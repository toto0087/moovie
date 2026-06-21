import { useCallback, useEffect, useRef, useState } from 'react';

// Idioma de la app → código de reconocimiento de voz (BCP-47).
const RECOGNITION_LANG = {
  es: 'es-AR',
  en: 'en-US',
  fr: 'fr-FR',
  pt: 'pt-BR',
  zh: 'zh-CN',
  ja: 'ja-JP',
};

/**
 * Dictado por voz con la Web Speech API del navegador (Chrome/Edge).
 * No usa ninguna API key: el navegador transcribe el micrófono.
 *
 * @param {object}   opts
 * @param {string}   opts.lang        Idioma de la app (es, en, ...).
 * @param {function} opts.onResult    Recibe el texto final transcripto.
 * @param {function} opts.onInterim   Recibe el texto parcial (mientras hablás).
 */
export function useSpeechRecognition({ lang = 'es', onResult, onInterim } = {}) {
  const Recognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;
  const supported = Boolean(Recognition);

  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  // Mantenemos las últimas callbacks sin recrear el reconocedor.
  const onResultRef = useRef(onResult);
  const onInterimRef = useRef(onInterim);
  useEffect(() => {
    onResultRef.current = onResult;
    onInterimRef.current = onInterim;
  });

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    if (!supported || listening) return;

    const recognition = new Recognition();
    recognition.lang = RECOGNITION_LANG[lang] ?? 'es-AR';
    recognition.interimResults = true; // texto en vivo mientras hablás
    recognition.continuous = false; // una frase y corta
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += chunk;
        else interim += chunk;
      }
      if (interim) onInterimRef.current?.(interim);
      if (final.trim()) onResultRef.current?.(final.trim());
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, [Recognition, supported, listening, lang]);

  // Cortar el reconocimiento si el componente se desmonta.
  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { supported, listening, start, stop };
}
