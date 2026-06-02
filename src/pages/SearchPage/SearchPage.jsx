import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { VoiceSearchAgent } from '../../components/VoiceSearchAgent/VoiceSearchAgent';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { movies, popularNow, sortByPopularityNow } from '../../data/movies';
import {
  AGENT_GREETING,
  VOICE_DEMO_PROMPT,
  VOICE_SUGGESTIONS,
  getAgentResponse,
} from './searchAgent';
import styles from './SearchPage.module.css';

function filterMovies(query) {
  const q = query.trim().toLowerCase();
  if (!q) return popularNow;
  return sortByPopularityNow(
    movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genre?.toLowerCase().includes(q) ||
        m.synopsis?.toLowerCase().includes(q)
    )
  );
}

export function SearchPage() {
  const [search, setSearch] = useState('');
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState('idle');
  const [messages, setMessages] = useState([AGENT_GREETING]);
  const [transcript, setTranscript] = useState('');
  const timersRef = useRef([]);

  const filtered = useMemo(() => filterMovies(search), [search]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const resolveAgentReply = useCallback((prompt) => {
    const label = prompt.label ?? prompt;
    const response =
      prompt.response ?? getAgentResponse(typeof prompt === 'string' ? prompt : label)?.response;
    const query =
      prompt.query ?? getAgentResponse(typeof prompt === 'string' ? prompt : label)?.query ?? label;

    return { label, response, query };
  }, []);

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
        setTimeout(() => finishAgentTurn(prompt), 2800)
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
    runVoiceFlow(VOICE_DEMO_PROMPT);
  }, [agentStatus, clearTimers, runVoiceFlow]);

  const handleSendMessage = useCallback(
    (text) => {
      const reply = getAgentResponse(text);
      if (!reply) return;

      clearTimers();
      setAgentStatus('thinking');

      timersRef.current.push(
        setTimeout(
          () => finishAgentTurn({ label: reply.label, response: reply.response, query: reply.query }),
          900
        )
      );
    },
    [clearTimers, finishAgentTurn]
  );

  const handleSuggestion = useCallback(
    (item) => {
      clearTimers();
      setAgentStatus('thinking');
      timersRef.current.push(setTimeout(() => finishAgentTurn(item), 700));
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
    ? 'Resultados'
    : agentOpen && messages.length > 1
      ? 'Para vos'
      : 'Explorá el catálogo';

  return (
    <div className={styles.page}>
      <PageHeader />

      <div className={styles.searchSection}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Películas, series, género…"
          onAgentClick={toggleAgent}
          agentOpen={agentOpen}
        />
      </div>

      {agentOpen && (
        <VoiceSearchAgent
          status={agentStatus}
          messages={messages}
          transcript={transcript}
          suggestions={VOICE_SUGGESTIONS}
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
        {filtered.length === 0 ? (
          <p className={styles.empty}>
            No encontramos títulos con esa búsqueda. Probá con el agente o otro término.
          </p>
        ) : (
          <MovieGrid movies={filtered} />
        )}
      </section>
    </div>
  );
}
