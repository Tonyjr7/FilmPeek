import fetchData from '../services/api.js';
import { simplifyMovieData, simplifyMovieDetails } from '../services/data_extractor.js';

import User from '../models/user.js';

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

// search movie by name or year
export const searchMovie = async (req, res) => {
  const { name, year } = req.query;

  if (!name && !year) {
    return res.status(400).json({ message: 'Please provide a movie name or year' });
  }

  try {
    const query = `search/movie?${name ? `query=${encodeURIComponent(name)}` : ''}${
      year ? `&year=${year}` : ''
    }`;
    const movies = await fetchData(query);

    return res.status(200).json(simplifyMovieData(movies.results));
  } catch (err) {
    return res.status(400).json({ message: 'An Error Ocurred', err });
  }
};

// save a movie to favorite
export const addMovieToFavorite = async (req, res) => {
  const movieId = req.body.movieId;

  if (!movieId) {
    return res.status(400).json({ message: 'Please include a movie' });
  }

  try {
    const user = await User.findById(req.userId);
    if (user.favoriteMovies.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in your favorites' });
    }

    user.favoriteMovies.push(movieId);
    await user.save();

    return res.status(201).json({ message: 'Movie added to favorite' });
  } catch (err) {
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  }
};

// fetch favorite movies
export const fetchFavoriteMovies = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const data = user.favoriteMovies;

    return res.status(200).json({ message: 'Favorite movie fetched', data });
  } catch (err) {
    return res.status(500).json({ message: 'An error occured', error: err.message });
  }
};

// create a watchlist
export const createWatchlist = async (req, res) => {
  const watchlistName = req.body.watchlistName;

  if (!watchlistName) {
    return res.status(400).json({ message: 'Please include a watchlist name' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exist = user.watchLists.some((list) => list.name === watchListName);
    if (exist) {
      return res.status(400).json({ message: 'You already have this watchlist' });
    }

    user.watchLists.push({ name: watchlistName, movies: [] });
    await user.save();

    return res.status(201).json({ message: 'Watchlist created' });
  } catch (err) {
    return res.status(500).json({ message: 'An error occured', error: err.message });
  }
};

// add movie to watchlist
export const addMovieToWatchList = async (req, res) => {
  const movieId = req.body.movieId;
  const watchListId = req.body.watchlistId;

  if (!movieId || !watchListId) {
    return res.status(400).json({ message: 'Please include a movie and a WatchList' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const watchlist = user.watchLists.find((list) => list._id.toString() === watchListId);
    if (!watchlist) {
      return res.status(400).json({ message: 'Watchlist Not Found' });
    }

    if (watchlist.movies.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    watchlist.movies.push(movieId);
    await user.save();

    return res.status(200).json({ message: 'movie added to watchlist' });
  } catch (err) {
    return res.status(400).json({ message: 'An error occured', error: err.message });
  }
};
