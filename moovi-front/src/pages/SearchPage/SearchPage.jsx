import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { VoiceSearchAgent } from '../../components/VoiceSearchAgent/VoiceSearchAgent';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useI18n } from '../../context/I18nContext';
import { useMovieSearch } from '../../hooks/useMovieSearch';
import { useGenres } from '../../hooks/useGenres';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { GenreFilter } from '../../components/GenreFilter/GenreFilter';
import { addSearchQuery, readSearchHistory } from '../../utils/searchHistory';
import { mapMovies } from '../../utils/mapMovie';
import { sendChatMessage } from '../../services/chatbot';
import { getAgentBundle } from '../../i18n/content/agent/index.js';
import { getAgentGreeting, getVoiceSuggestions } from './searchAgent';
import styles from './SearchPage.module.css';

export function SearchPage() {
  const { t, language } = useI18n();
  const { settings } = useAppSettings();
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState(null);
  const genres = useGenres();
  const { movies: filtered, loading } = useMovieSearch(search, activeGenre);
  const [recentSearches, setRecentSearches] = useState(readSearchHistory);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState('idle'); // 'idle' | 'thinking'
  const [messages, setMessages] = useState(() => [getAgentGreeting(language)]);
  const [transcript, setTranscript] = useState('');
  // Películas recomendadas por el agente (Gemini). null = el agente todavía no respondió.
  const [agentResults, setAgentResults] = useState(null);

  const voiceSuggestions = useMemo(() => getVoiceSuggestions(language), [language]);

  useEffect(() => {
    setMessages([getAgentGreeting(language)]);
  }, [language]);

  useEffect(() => {
    if (!settings.saveSearchHistory) return undefined;
    const timer = setTimeout(() => {
      if (search.trim().length >= 2) {
        setRecentSearches(addSearchQuery(search));
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [search, settings.saveSearchHistory]);

  // Núcleo del chatbot: manda el mensaje al backend (que llama a Gemini) y
  // muestra la respuesta + las películas recomendadas del catálogo.
  const askAgent = useCallback(
    async (userText) => {
      const text = (userText ?? '').trim();
      if (!text) return;

      setMessages((prev) => [...prev, { role: 'user', text }]);
      setAgentStatus('thinking');
      setTranscript('');

      try {
        const { reply, movies } = await sendChatMessage(text, language);
        setMessages((prev) => [...prev, { role: 'agent', text: reply }]);
        setAgentResults(mapMovies(movies));
      } catch {
        const bundle = getAgentBundle(language);
        const errorText =
          bundle.errorResponse ??
          'No pude conectarme con el asistente. Probá de nuevo.';
        setMessages((prev) => [...prev, { role: 'agent', text: errorText }]);
      } finally {
        setAgentStatus('idle');
      }
    },
    [language]
  );

  // Dictado por voz real (Web Speech API del navegador).
  const {
    supported: voiceSupported,
    listening,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    lang: language,
    onInterim: (text) => setTranscript(text),
    onResult: (text) => {
      setTranscript(text);
      askAgent(text);
    },
  });

  const handleListen = useCallback(() => {
    if (listening) {
      stopListening();
      return;
    }
    if (agentStatus === 'thinking') return;

    if (!voiceSupported) {
      const bundle = getAgentBundle(language);
      const msg =
        bundle.voiceUnsupported ??
        'Tu navegador no soporta dictado por voz. Escribime el mensaje.';
      if (!agentOpen) setAgentOpen(true);
      setMessages((prev) => [...prev, { role: 'agent', text: msg }]);
      return;
    }

    if (!agentOpen) setAgentOpen(true);
    setTranscript('');
    startListening();
  }, [listening, agentStatus, voiceSupported, agentOpen, language, startListening, stopListening]);

  const handleSendMessage = useCallback((text) => askAgent(text), [askAgent]);

  const handleSuggestion = useCallback((item) => askAgent(item.label), [askAgent]);

  const toggleAgent = useCallback(() => {
    setAgentOpen((open) => !open);
    if (listening) stopListening();
  }, [listening, stopListening]);

  // Mientras escucha, mostramos 'listening'; si no, el estado del chat ('idle'/'thinking').
  const voiceStatus = listening ? 'listening' : agentStatus;

  // Si el usuario busca por texto o género, manda la búsqueda normal;
  // si no, y el agente ya recomendó algo, mostramos sus picks.
  const usingAgentResults = !search.trim() && !activeGenre && agentResults !== null;
  const gridMovies = usingAgentResults ? agentResults : filtered;
  const gridLoading = usingAgentResults ? false : loading;

  const resultsTitle = search.trim()
    ? t('search.results')
    : usingAgentResults || (agentOpen && messages.length > 1)
      ? t('search.forYou')
      : t('search.explore');

  return (
    <div className={styles.page}>
      <PageHeader />

      <div className={styles.searchSection}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={t('search.placeholder')}
          onAgentClick={toggleAgent}
          agentOpen={agentOpen}
        />

        {genres.length > 0 && (
          <div className={styles.genreFilter}>
            <GenreFilter
              genres={genres}
              activeGenre={activeGenre}
              onSelect={setActiveGenre}
              allLabel="Todo"
            />
          </div>
        )}

        {!search.trim() && !activeGenre && settings.saveSearchHistory && recentSearches.length > 0 && (
          <div className={styles.recent} aria-label={t('search.recentAria')}>
            <p className={styles.recentLabel}>{t('search.recent')}</p>
            <div className={styles.recentChips}>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  className={styles.recentChip}
                  onClick={() => setSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {agentOpen && (
        <VoiceSearchAgent
          status={voiceStatus}
          messages={messages}
          transcript={transcript}
          suggestions={voiceSuggestions}
          onClose={() => setAgentOpen(false)}
          onListen={handleListen}
          onSuggestion={handleSuggestion}
          onSendMessage={handleSendMessage}
        />
      )}

      <section className={styles.results} aria-labelledby="search-results-heading">
        <h2 id="search-results-heading" className={styles.resultsTitle}>
          {resultsTitle}
        </h2>
        {gridLoading ? (
          <p className={styles.empty}>{t('common.loading')}</p>
        ) : gridMovies.length === 0 ? (
          <p className={styles.empty}>{t('search.empty')}</p>
        ) : (
          <MovieGrid movies={gridMovies} />
        )}
      </section>
    </div>
  );
}
