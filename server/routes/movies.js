import express from 'express';
import { fetchMovieDetail, fetchPopularMovies } from '../controllers/movies.js';

const router = express.Router();

// fetch Top 10 popular movies
router.get('/popular-movies', fetchPopularMovies);

// fetch a movie details by it's Id
router.get('/:id', fetchMovieDetail);

export default router;
