import express from 'express';
import {
  addMovieToFavorite,
  addMovieToWatchList,
  createWatchlist,
  deleteWatchlist,
  fetchFavoriteMovies,
  fetchMovieDetail,
  fetchPopularMovies,
  fetchSimilarMovies,
  fetchTopRatedMovies,
  fetchTrendingMovie,
  fetchWatchlist,
  fetchWatchLists,
  removeMovieFromFavorite,
  removeMovieFromWatchlist,
  searchMovie,
} from '../controllers/movies.js';

import verifyToken from '../services/verifyToken.js';

const router = express.Router();

// save a favorite movie
router.post('/user/favorites/add', verifyToken, addMovieToFavorite);

// fetch all favorute movies
router.get('/user/favorites', verifyToken, fetchFavoriteMovies);

// remove a movie from favorites
router.post('/user/favorites/remove', verifyToken, removeMovieFromFavorite);

// create a watchlist
router.post('/user/watchlist/create-watchlist', verifyToken, createWatchlist);

// add a movie to watchlist
router.patch('/user/watchlist/add-movie', verifyToken, addMovieToWatchList);

// remove a movie from a watchlist
router.post('/user/watchlist/delete-movie', verifyToken, removeMovieFromWatchlist);

// fetch all watchlist
router.get('/user/watchlists', verifyToken, fetchWatchLists);

// delete a watchlist
router.delete('/user/watchlist/:id', verifyToken, deleteWatchlist);

// fetch a watchlist
router.get('/user/watchlist/:id', verifyToken, fetchWatchlist);

// fetch similiar movies
router.get('/:id/similar', fetchSimilarMovies);

// search for movies with a name or year
router.get('/search', searchMovie);

// fetch Top 10 popular movies
router.get('/popular-movies', fetchPopularMovies);

// fetch trending movie
router.get('/trending', fetchTrendingMovie);

// fetch top rated movies
router.get('/top-rated', fetchTopRatedMovies);

// fetch a movie details by it's Id
router.get('/:id', fetchMovieDetail);

export default router;
