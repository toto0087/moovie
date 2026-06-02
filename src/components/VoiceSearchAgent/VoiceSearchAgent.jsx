import { useState } from 'react';
import { FiMic, FiMicOff, FiSend, FiX } from 'react-icons/fi';
import styles from './VoiceSearchAgent.module.css';

const STATUS_LABELS = {
  idle: 'Escribime o usá el micrófono',
  listening: 'Escuchando…',
  thinking: 'Buscando lo mejor para vos…',
};

export function VoiceSearchAgent({
  status = 'idle',
  messages = [],
  transcript = '',
  suggestions = [],
  onClose,
  onListen,
  onSuggestion,
  onSendMessage,
}) {
  const [draft, setDraft] = useState('');
  const isListening = status === 'listening';
  const isThinking = status === 'thinking';
  const isActive = isListening || isThinking;

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || isThinking) return;
    onSendMessage?.(text);
    setDraft('');
  };

  return (
    <section className={styles.panel} aria-label="Asistente Moovi">
      <div className={styles.header}>
        <div className={styles.agentMeta}>
          <span className={styles.badge}>Agente Moovi</span>
          <p className={styles.status}>{STATUS_LABELS[status] ?? STATUS_LABELS.idle}</p>
        </div>
        <div
          className={`${styles.orbWrap} ${isActive ? styles.orbActive : ''}`}
          aria-hidden
        >
          <span className={styles.ring} />
          <span className={styles.ring} />
          <span className={styles.orb} />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Cerrar asistente"
        >
          <FiX aria-hidden />
        </button>
      </div>

      {isListening && (
        <div className={styles.waveform} aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={styles.bar} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {transcript && (
        <p className={styles.transcript} aria-live="polite">
          &ldquo;{transcript}&rdquo;
        </p>
      )}

      <ul className={styles.chat} aria-label="Conversación con el agente">
        {messages.map((msg, index) => (
          <li
            key={`${msg.role}-${index}`}
            className={msg.role === 'user' ? styles.bubbleUser : styles.bubbleAgent}
          >
            {msg.role === 'agent' && <span className={styles.bubbleLabel}>Moovi</span>}
            <p>{msg.text}</p>
          </li>
        ))}
      </ul>

      {suggestions.length > 0 && status === 'idle' && (
        <div className={styles.suggestions}>
          <p className={styles.suggestionsLabel}>Sugerencias</p>
          <div className={styles.chips}>
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.chip}
                onClick={() => onSuggestion?.(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.composerInput}
          placeholder="Escribile a Moovi…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={isThinking}
          aria-label="Mensaje para el agente"
        />
        <button
          type="button"
          className={`${styles.composerMic} ${isListening ? styles.composerMicActive : ''}`}
          onClick={onListen}
          disabled={isThinking}
          aria-pressed={isListening}
          aria-label={isListening ? 'Detener escucha' : 'Hablar con el agente'}
        >
          {isListening ? <FiMicOff aria-hidden /> : <FiMic aria-hidden />}
        </button>
        <button
          type="submit"
          className={styles.composerSend}
          disabled={!draft.trim() || isThinking}
          aria-label="Enviar mensaje"
        >
          <FiSend aria-hidden />
        </button>
      </form>
    </section>
  );
}
