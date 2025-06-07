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

// fetch trending movie
export const fetchTrendingMovie = async (req, res) => {
  try {
    const movies = await fetchData('trending/movie/day?language=en-US');
    const simpleResponse = simplifyMovieData(movies.results);

    return res.status(200).json(simpleResponse);
  } catch (err) {
    return res.status(500).json({ message: 'An error occured', error: err.message });
  }
};

// fetch top rated movies
export const fetchTopRatedMovies = async (req, res) => {
  try {
    const movies = await fetchData('/movie/top_rated?language=en-US');
    const simpleResponse = simplifyMovieData(movies.results);

    return res.status(200).json(simpleResponse);
  } catch (err) {
    return res.status(500).json({ message: 'An error occured', error: err.message });
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

// fetch similiar movies
export const fetchSimilarMovies = async (req, res) => {
  const movieId = req.params.id;

  try {
    const similarMovies = await fetchData(`movie/${movieId}/similar?language=en-US&page=1`);

    return res.status(200).json(similarMovies);
  } catch (err) {
    return res.status(400).json({ message: 'An error occured', error: err.message });
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

// remove a movie from favorite
export const removeMovieFromFavorite = async (req, res) => {
  const movieId = req.body.movieId;

  if (!movieId) {
    return res.status(400).json({ message: 'Please include a movie' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user.favoriteMovies.includes(movieId)) {
      return res.status(400).json({ message: 'Movie not in favorites' });
    }

    user.favoriteMovies.pull(movieId);
    await user.save();

    return res.status(201).json({ message: 'Movie removed from favorite' });
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

  // require watchlist name
  if (!watchlistName) {
    return res.status(400).json({ message: 'Please include a watchlist name' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // check if watchlist exists
    const exist = user.watchLists.some((list) => list.name === watchListName);
    if (exist) {
      return res.status(400).json({ message: 'You already have this watchlist' });
    }

    // save watchlist
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

// remove a movie from a watchlist
export const removeMovieFromWatchlist = async (req, res) => {
  const movieId = req.body.movieId;
  const watchListId = req.body.id;

  if (!watchListId || !movieId) {
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

    if (!watchlist.movies.includes(movieId)) {
      return res.status(400).json({ message: 'Movie does not exist in this watchlist' });
    }

    watchlist.movies.pull(movieId);
    await user.save();

    return res.status(200).json({ message: 'movie removed from watchlist' });
  } catch (err) {
    return res.status(400).json({ message: 'An error occured', error: err.message });
  }
};

// delete a watchlist
export const deleteWatchlist = async (req, res) => {
  const watchListId = req.params.id;
  if (!watchListId) {
    return res.status(400).json({ message: 'specify a watchlist' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const data = user.watchLists;

    const watchlist = user.watchLists.find((list) => list._id.toString() === watchListId);
    if (!watchlist) {
      return res.status(400).json({ message: 'Watchlist Not Found' });
    }

    user.watchLists.pull({ _id: watchListId });
    await user.save();

    return res.status(200).json({ message: 'Watchlist deleted!', data });
  } catch (err) {
    return res.status(500).json({ message: 'An error occured', error: err.message });
  }
};

// fetch a watchlist
export const fetchWatchlist = async (req, res) => {
  const watchListId = req.params.id;

  if (!watchListId) {
    return res.status(400).json({ message: 'please specify a watchlist' });
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

    return res.status(200).json({ message: 'watchlist fetched!', watchlist });
  } catch (err) {
    res.status(500).json({ message: 'An error occured', error: err.message });
  }
};

// fetch all watchlist
export const fetchWatchLists = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const watchlists = user.watchLists;

    return res.status(200).json({ message: 'Watchlists fetched', watchlists });
  } catch (err) {
    return res.status(500).json({ message: 'An error occured', error: err.message });
  }
};
