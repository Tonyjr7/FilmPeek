import dotenv from 'dotenv';
import cache from './cache.js';

dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-20b';

const callGroq = async (messages, temperature = 0.7, maxTokens = 1024) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in environment variables.');

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error('Groq API error ' + res.status + ': ' + errText);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content || '';
};

/**
 * AI Movie Match - given a natural language query, return up to 8 ranked movies.
 */
export const getAIMovieMatch = async (query) => {
  const cacheKey = 'ai_match:' + query.toLowerCase().trim();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const systemPrompt =
    'You are FilmPeek\'s AI movie curator. Reply ONLY with a valid JSON array (no markdown, no extra text) of up to 8 objects:\n' +
    '[{ "title": "Movie Title", "year": 2020, "reason": "One-sentence reason", "matchScore": 94 }]\n' +
    'matchScore is an integer from 60-99. Sort by matchScore descending. Only recommend real movies.';

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: query },
  ];

  const raw = await callGroq(messages, 0.6, 800);

  let results;
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    results = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch {
    console.log(raw);
    throw new Error('Failed to parse AI response as JSON.');
  }

  cache.set(cacheKey, results, 600); // cache 10 min
  return results;
};

/**
 * Recommendation Explanation - explain why someone would love this movie.
 */
export const getRecommendationExplanation = async (movieTitle, genres, overview) => {
  const cacheKey = 'ai_explain:' + movieTitle.toLowerCase().trim();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const systemPrompt =
    'You are FilmPeek\'s AI recommendation explainer. Reply ONLY with valid JSON (no markdown):\n' +
    '{ "tagline": "Short punchy tagline max 10 words", "reasons": ["Reason 1 max 6 words", "Reason 2", "Reason 3", "Reason 4"], "vibe": "One-word mood", "bestFor": "Who enjoys this most", "matchScore": 88 }\n' +
    'matchScore is a realistic integer 70-99.';

  const userContent =
    'Movie: "' + movieTitle + '"\n' +
    'Genres: ' + ((genres || []).join(', ') || 'Unknown') + '\n' +
    'Overview: ' + (overview || 'Not provided');

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ];

  const raw = await callGroq(messages, 0.65, 512);

  let result;
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    result = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch {
    throw new Error('Failed to parse AI explanation as JSON.');
  }

  cache.set(cacheKey, result, 3600); // cache 1 hour
  return result;
};
