export const AGENT_GREETING = {
  role: 'agent',
  text: 'Hola, soy Moovi. Contame qué mood tenés o qué querés ver y te armo una selección.',
};

export const VOICE_SUGGESTIONS = [
  {
    id: 'anime',
    label: 'Algo de anime',
    query: 'anime',
    response:
      'Perfecto: te dejo Demon Slayer y One Piece. Son de los más buscados en anime.',
  },
  {
    id: 'terror',
    label: 'Terror para hoy',
    query: 'terror',
    response:
      'Para un plan intenso: Stranger Things y The Walking Dead encajan muy bien.',
  },
  {
    id: 'drama',
    label: 'Drama histórico',
    query: 'drama',
    response: 'The Crown y Vikingos son excelentes si te gusta el drama histórico.',
  },
  {
    id: 'corto',
    label: 'Algo corto',
    query: 'whiplash',
    response: 'Whiplash es ideal si querés una película contundente y sin maratón.',
  },
];

export const VOICE_DEMO_PROMPT = {
  label: 'Quiero una serie de suspenso',
  query: 'suspenso',
  response:
    'Stranger Things es mi primera recomendación: mezcla misterio, nostalgia y mucho suspenso.',
};

export function getAgentResponse(userText) {
  const q = userText.trim().toLowerCase();
  if (!q) return null;

  const matched = VOICE_SUGGESTIONS.find(
    (item) =>
      q.includes(item.id) ||
      q.includes(item.query) ||
      item.label.toLowerCase().includes(q) ||
      q.split(/\s+/).some((word) => word.length > 3 && item.label.toLowerCase().includes(word))
  );

  if (matched) {
    return { query: matched.query, response: matched.response, label: userText.trim() };
  }

  if (q.includes('suspenso') || q.includes('misterio')) {
    return { query: 'suspenso', response: VOICE_DEMO_PROMPT.response, label: userText.trim() };
  }

  return {
    query: q,
    response: `Entendido. Te muestro lo que encontré para "${userText.trim()}".`,
    label: userText.trim(),
  };
}
