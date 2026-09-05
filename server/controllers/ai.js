import { getAIMovieMatch, getRecommendationExplanation } from '../services/aiService.js';
import fetchData from '../services/api.js';

/**
 * POST /api/ai/match
 * Body: { query: string }
 */
export const aiMovieMatch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Query is required.' });
    }

    const suggestions = await getAIMovieMatch(query.trim());

    const enriched = await Promise.all(
      suggestions.map(async (suggestion) => {
        try {
          const encodedTitle = encodeURIComponent(suggestion.title);
          const year = suggestion.year || '';
          const searchRes = await fetchData(
            `search/movie?query=${encodedTitle}&year=${year}&language=en-US`
          );
          const tmdbMovie = searchRes.results?.[0];
          if (!tmdbMovie) return { ...suggestion, tmdbData: null };
          return {
            ...suggestion,
            tmdbData: {
              id: tmdbMovie.id,
              title: tmdbMovie.title,
              poster_path: tmdbMovie.poster_path,
              backdrop_path: tmdbMovie.backdrop_path,
              release_date: tmdbMovie.release_date,
              vote_average: tmdbMovie.vote_average,
              overview: tmdbMovie.overview,
              genre_ids: tmdbMovie.genre_ids,
              media_type: 'movie',
            },
          };
        } catch {
          return { ...suggestion, tmdbData: null };
        }
      })
    );

    return res.status(200).json(enriched.filter((m) => m.tmdbData !== null));
  } catch (err) {
    console.error('AI Movie Match error:', err.message);
    return res.status(500).json({ message: 'AI service error', error: err.message });
  }
};

/**
 * POST /api/ai/explain
 * Body: { movieTitle: string, genres: string[], overview: string }
 */
export const recommendationExplanation = async (req, res) => {
  try {
    const { movieTitle, genres, overview } = req.body;
    if (!movieTitle) {
      return res.status(400).json({ message: 'movieTitle is required.' });
    }
    const result = await getRecommendationExplanation(movieTitle, genres || [], overview || '');
    return res.status(200).json(result);
  } catch (err) {
    console.error('Recommendation Explanation error:', err.message);
    return res.status(500).json({ message: 'AI service error', error: err.message });
  }
};
