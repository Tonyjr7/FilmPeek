import fetchData from '../services/api.js';
import { simplifyMovieData, simplifyMovieDetails } from '../services/data_extractor.js';
import cache from '../services/cache.js';

// fetch popular series - Top 10
export const fetchPopularSeries = async (req, res) => {
  try {
    const series = await fetchData('tv/popular');
    const simpleResponse = simplifyMovieData(series.results);
    const top10PopularSeries = simpleResponse.slice(0, 10);

    return res.status(200).json(top10PopularSeries);
  } catch (err) {
    return res.status(400).json({ message: 'An error occured', error: err.message });
  }
};

// fetch trending series
export const fetchTrendingSeries = async (req, res) => {
  try {
    const series = await fetchData('trending/tv/day?language=en-US');
    const simpleResponse = simplifyMovieData(series.results);

    return res.status(200).json(simpleResponse);
  } catch (err) {
    return res.status(500).json({ message: 'An error occured', error: err.message });
  }
};

// fetch top rated series
export const fetchTopRatedSeries = async (req, res) => {
  try {
    const series = await fetchData('tv/top_rated?language=en-US');
    const simpleResponse = simplifyMovieData(series.results);

    return res.status(200).json(simpleResponse);
  } catch (err) {
    return res.status(500).json({ message: 'An error occured', error: err.message });
  }
};

// fetch series details
export const fetchSeriesDetail = async (req, res) => {
  const seriesId = req.params.id;

  try {
    const series = await fetchData(`tv/${seriesId}?language=en-US`);
    if (!series || series.success === false) {
      return res.status(400).json({ message: 'An error occured' });
    }

    return res.status(200).json(simplifyMovieDetails(series));
  } catch (err) {
    return res.status(400).json({ message: 'An error occured' });
  }
};

// fetch similar series
export const fetchSimilarSeries = async (req, res) => {
  const seriesId = req.params.id;

  const cacheKey = `similar_series_${seriesId}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.status(200).json(cached);

  try {
    const similarSeries = await fetchData(`tv/${seriesId}/similar?language=en-US&page=1`);
    cache.set(cacheKey, similarSeries);

    return res.status(200).json(similarSeries);
  } catch (err) {
    return res.status(400).json({ message: 'An error occured', error: err.message });
  }
};

// search series by name
export const searchSeries = async (req, res) => {
  const { name, year } = req.query;

  if (!name && !year) {
    return res.status(400).json({ message: 'Please provide a series name or year' });
  }

  try {
    const query = `search/tv?${name ? `query=${encodeURIComponent(name)}` : ''}${
      year ? `&first_air_date_year=${year}` : ''
    }`;
    const series = await fetchData(query);

    return res.status(200).json(simplifyMovieData(series.results));
  } catch (err) {
    return res.status(400).json({ message: 'An Error Ocurred', err });
  }
};

// fetch series trailer id
export const fetchSeriesTrailer = async (req, res) => {
  const seriesId = req.params.id;

  try {
    const trailerData = await fetchData(`tv/${seriesId}/videos`);
    if (trailerData?.results?.length > 0) {
      const officialTrailer =
        trailerData.results.find(
          (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
        ) || trailerData.results[0];
      return res.status(200).json({ message: officialTrailer.key });
    }
    return res.status(404).json({ message: 'Trailer not found' });
  } catch (err) {
    return res.status(500).json({ message: 'An error occured', error: err.message });
  }
};

// fetch series season detail (episodes)
export const fetchSeriesSeasonDetail = async (req, res) => {
  const { id, seasonNumber } = req.params;

  const cacheKey = `series_${id}_season_${seasonNumber}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.status(200).json(cached);

  try {
    const seasonData = await fetchData(`tv/${id}/season/${seasonNumber}?language=en-US`);
    if (!seasonData || seasonData.success === false) {
      return res.status(400).json({ message: 'Season details not found' });
    }

    const response = {
      id: seasonData.id,
      season_number: seasonData.season_number,
      name: seasonData.name,
      overview: seasonData.overview,
      poster_path: seasonData.poster_path,
      episodes: (seasonData.episodes || []).map((ep) => ({
        id: ep.id,
        episode_number: ep.episode_number,
        name: ep.name,
        overview: ep.overview,
        still_path: ep.still_path,
        runtime: ep.runtime,
        air_date: ep.air_date,
        vote_average: ep.vote_average,
      })),
    };

    cache.set(cacheKey, response);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({ message: 'An error occurred', error: err.message });
  }
};

