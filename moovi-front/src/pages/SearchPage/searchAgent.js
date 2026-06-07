import { getAgentBundle } from '../../i18n/content/agent/index.js';

export function getAgentGreeting(language) {
  const bundle = getAgentBundle(language);
  return { role: 'agent', text: bundle.greeting };
}

export function getVoiceSuggestions(language) {
  return getAgentBundle(language).suggestions;
}

export function getVoiceDemoPrompt(language) {
  return getAgentBundle(language).demoPrompt;
}

export function getAgentResponse(userText, language) {
  const bundle = getAgentBundle(language);
  const q = userText.trim().toLowerCase();
  if (!q) return null;

  const matched = bundle.suggestions.find(
    (item) =>
      q.includes(item.id) ||
      q.includes(item.query) ||
      item.label.toLowerCase().includes(q) ||
      q.split(/\s+/).some((word) => word.length > 3 && item.label.toLowerCase().includes(word))
  );

  if (matched) {
    return { query: matched.query, response: matched.response, label: userText.trim() };
  }

  if (q.includes('suspenso') || q.includes('mystery') || q.includes('suspense') || q.includes('悬疑')) {
    const demo = bundle.demoPrompt;
    return { query: demo.query, response: demo.response, label: userText.trim() };
  }

  return {
    query: q,
    response: bundle.fallbackResponse.replace('{{query}}', userText.trim()),
    label: userText.trim(),
  };
}
