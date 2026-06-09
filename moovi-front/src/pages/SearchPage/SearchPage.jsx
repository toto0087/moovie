import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { VoiceSearchAgent } from '../../components/VoiceSearchAgent/VoiceSearchAgent';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useI18n } from '../../context/I18nContext';
import { useMovieSearch } from '../../hooks/useMovieSearch';
import { useGenres } from '../../hooks/useGenres';
import { GenreFilter } from '../../components/GenreFilter/GenreFilter';
import { addSearchQuery, readSearchHistory } from '../../utils/searchHistory';
import {
  getAgentGreeting,
  getAgentResponse,
  getVoiceDemoPrompt,
  getVoiceSuggestions,
} from './searchAgent';
import styles from './SearchPage.module.css';

const AGENT_REPLY_DELAY_MS = 3000;

export function SearchPage() {
  const { t, language } = useI18n();
  const { settings } = useAppSettings();
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState(null);
  const genres = useGenres();
  const { movies: filtered, loading } = useMovieSearch(search, activeGenre);
  const [recentSearches, setRecentSearches] = useState(readSearchHistory);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState('idle');
  const [messages, setMessages] = useState(() => [getAgentGreeting(language)]);
  const [transcript, setTranscript] = useState('');
  const timersRef = useRef([]);

  const voiceSuggestions = useMemo(() => getVoiceSuggestions(language), [language]);
  const voiceDemoPrompt = useMemo(() => getVoiceDemoPrompt(language), [language]);

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

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const resolveAgentReply = useCallback(
    (prompt) => {
      const label = prompt.label ?? prompt;
      const response =
        prompt.response ??
        getAgentResponse(typeof prompt === 'string' ? prompt : label, language)?.response;
      const query =
        prompt.query ??
        getAgentResponse(typeof prompt === 'string' ? prompt : label, language)?.query ??
        label;

      return { label, response, query };
    },
    [language]
  );

  const finishAgentTurn = useCallback(
    (prompt) => {
      const { label, response, query } = resolveAgentReply(prompt);
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: label },
        { role: 'agent', text: response },
      ]);
      setSearch(query);
      setTranscript('');
      setAgentStatus('idle');
    },
    [resolveAgentReply]
  );

  const runVoiceFlow = useCallback(
    (prompt) => {
      clearTimers();
      if (!agentOpen) setAgentOpen(true);
      setAgentStatus('listening');
      setTranscript('');

      const label = prompt.label ?? prompt;

      timersRef.current.push(
        setTimeout(() => setTranscript(label), 700),
        setTimeout(() => setAgentStatus('thinking'), 1600),
        setTimeout(() => finishAgentTurn(prompt), 1600 + AGENT_REPLY_DELAY_MS)
      );
    },
    [agentOpen, clearTimers, finishAgentTurn]
  );

  const handleListen = useCallback(() => {
    if (agentStatus === 'listening') {
      clearTimers();
      setAgentStatus('idle');
      setTranscript('');
      return;
    }
    if (agentStatus !== 'idle') return;
    runVoiceFlow(voiceDemoPrompt);
  }, [agentStatus, clearTimers, runVoiceFlow, voiceDemoPrompt]);

  const handleSendMessage = useCallback(
    (text) => {
      const reply = getAgentResponse(text, language);
      if (!reply) return;

      clearTimers();
      setAgentStatus('thinking');

      timersRef.current.push(
        setTimeout(
          () => finishAgentTurn({ label: reply.label, response: reply.response, query: reply.query }),
          AGENT_REPLY_DELAY_MS
        )
      );
    },
    [clearTimers, finishAgentTurn, language]
  );

  const handleSuggestion = useCallback(
    (item) => {
      clearTimers();
      setAgentStatus('thinking');
      timersRef.current.push(setTimeout(() => finishAgentTurn(item), AGENT_REPLY_DELAY_MS));
    },
    [clearTimers, finishAgentTurn]
  );

  const toggleAgent = useCallback(() => {
    setAgentOpen((open) => !open);
    if (agentStatus === 'listening') {
      clearTimers();
      setAgentStatus('idle');
      setTranscript('');
    }
  }, [agentStatus, clearTimers]);

  const resultsTitle = search.trim()
    ? t('search.results')
    : agentOpen && messages.length > 1
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
          status={agentStatus}
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
        {loading ? (
          <p className={styles.empty}>{t('common.loading')}</p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>{t('search.empty')}</p>
        ) : (
          <MovieGrid movies={filtered} />
        )}
      </section>
    </div>
  );
}
