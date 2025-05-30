import express from 'express';
import {
  addMovieToFavorite,
  fetchMovieDetail,
  fetchPopularMovies,
  searchMovie,
} from '../controllers/movies.js';

import verifyToken from '../services/verifyToken.js';

const router = express.Router();

// save a favorite movie
router.post('/user/favorites', verifyToken, addMovieToFavorite);

// search for movies with a name or year
router.get('/search', searchMovie);

// fetch Top 10 popular movies
router.get('/popular-movies', fetchPopularMovies);

// fetch a movie details by it's Id
router.get('/:id', fetchMovieDetail);

export default router;
