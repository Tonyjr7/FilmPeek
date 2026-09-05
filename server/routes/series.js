import express from 'express';
import {
  fetchPopularSeries,
  fetchTrendingSeries,
  fetchTopRatedSeries,
  fetchSeriesDetail,
  fetchSimilarSeries,
  searchSeries,
  fetchSeriesTrailer,
  fetchSeriesSeasonDetail,
} from '../controllers/series.js';

const router = express.Router();

// fetch series trailer
router.get('/trailer/:id', fetchSeriesTrailer);

// search series
router.get('/search', searchSeries);

// fetch popular series
router.get('/popular-series', fetchPopularSeries);

// fetch trending series
router.get('/trending', fetchTrendingSeries);

// fetch top rated series
router.get('/top-rated', fetchTopRatedSeries);

// fetch season details with episodes
router.get('/:id/season/:seasonNumber', fetchSeriesSeasonDetail);

// fetch similar series
router.get('/:id/similar', fetchSimilarSeries);

// fetch series detail by id
router.get('/:id', fetchSeriesDetail);

export default router;
