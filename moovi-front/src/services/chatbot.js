import api from './api';

/**
 * Envía un mensaje al chatbot (backend → Gemini, grounded en el catálogo).
 * Devuelve { reply: string, movies: FormattedMovie[] }.
 */
export async function sendChatMessage(message, language) {
  const { data } = await api.post('/chatbot', { message, lang: language });
  return data;
}
