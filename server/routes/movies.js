import express from 'express';
import {
  addMovieToFavorite,
  addMovieToWatchList,
  createWatchlist,
  deleteWatchlist,
  fetchFavoriteMovies,
  fetchMovieDetail,
  fetchPopularMovies,
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
router.delete('/user/favorites/delete/:id', verifyToken, removeMovieFromFavorite);

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

// search for movies with a name or year
router.get('/search', searchMovie);

// fetch Top 10 popular movies
router.get('/popular-movies', fetchPopularMovies);

// fetch a movie details by it's Id
router.get('/:id', fetchMovieDetail);

export default router;
