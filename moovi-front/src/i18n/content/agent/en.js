export default {
  greeting: 'Hi, I\'m Moovi. Tell me your mood or what you want to watch and I\'ll build a selection.',
  statusIdle: 'Type or use the microphone',
  statusListening: 'Listening…',
  statusThinking: 'Finding the best picks for you…',
  panelAria: 'Moovi assistant',
  closeAria: 'Close assistant',
  chatAria: 'Conversation with agent',
  suggestionsLabel: 'Suggestions',
  placeholder: 'Message Moovi…',
  messageAria: 'Message for agent',
  micStart: 'Talk to agent',
  micStop: 'Stop listening',
  sendAria: 'Send message',
  suggestions: [
    {
      id: 'anime',
      label: 'Something anime',
      query: 'anime',
      response: 'Great picks: Demon Slayer and One Piece are among the most searched anime.',
    },
    {
      id: 'terror',
      label: 'Horror for tonight',
      query: 'terror',
      response: 'For an intense night: Stranger Things and The Walking Dead fit perfectly.',
    },
    {
      id: 'drama',
      label: 'Historical drama',
      query: 'drama',
      response: 'The Crown and Vikings are excellent if you like historical drama.',
    },
    {
      id: 'corto',
      label: 'Something short',
      query: 'whiplash',
      response: 'Whiplash is ideal if you want a powerful film without a long binge.',
    },
  ],
  demoPrompt: {
    label: 'I want a suspense series',
    query: 'suspenso',
    response:
      'Stranger Things is my top pick: mystery, nostalgia and plenty of suspense.',
  },
  fallbackResponse: 'Got it. Here\'s what I found for "{{query}}".',
};
