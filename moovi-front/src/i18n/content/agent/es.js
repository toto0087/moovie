export default {
  greeting: 'Hola, soy Moovi. Contame qué mood tenés o qué querés ver y te armo una selección.',
  statusIdle: 'Escribime o usá el micrófono',
  statusListening: 'Escuchando…',
  statusThinking: 'Buscando lo mejor para vos…',
  panelAria: 'Asistente Moovi',
  closeAria: 'Cerrar asistente',
  chatAria: 'Conversación con el agente',
  suggestionsLabel: 'Sugerencias',
  placeholder: 'Escribile a Moovi…',
  messageAria: 'Mensaje para el agente',
  micStart: 'Hablar con el agente',
  micStop: 'Detener escucha',
  sendAria: 'Enviar mensaje',
  suggestions: [
    {
      id: 'anime',
      label: 'Algo de anime',
      query: 'anime',
      response: 'Perfecto: te dejo Demon Slayer y One Piece. Son de los más buscados en anime.',
    },
    {
      id: 'terror',
      label: 'Terror para hoy',
      query: 'terror',
      response: 'Para un plan intenso: Stranger Things y The Walking Dead encajan muy bien.',
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
  ],
  demoPrompt: {
    label: 'Quiero una serie de suspenso',
    query: 'suspenso',
    response:
      'Stranger Things es mi primera recomendación: mezcla misterio, nostalgia y mucho suspenso.',
  },
  fallbackResponse: 'Entendido. Te muestro lo que encontré para "{{query}}".',
};
