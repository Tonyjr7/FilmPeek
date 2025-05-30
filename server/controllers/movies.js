import fetchData from '../services/api.js';
import { simplifyMovieData, simplifyMovieDetails } from '../services/data_extractor.js';

// fetch popular movies - Top 10
export const fetchPopularMovies = async (req, res) => {
  try {
    const movies = await fetchData('movie/popular');
    const simpleResponse = simplifyMovieData(movies.results);
    const top10PopularMovies = simpleResponse.slice(0, 10);

    return res.status(200).json(top10PopularMovies);
  } catch (err) {
    return res.status(400).json({ message: 'An error occured', err });
  }
};

// fetch a movie details
export const fetchMovieDetail = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await fetchData(`movie/${movieId}?language=en-US`);

    return res.status(200).json(simplifyMovieDetails(movie));
  } catch (err) {
    return res.status(400).json({ message: 'An error occured' });
  }
};
