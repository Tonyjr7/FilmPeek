// extractor for movie and TV series data
export const simplifyMovieData = (movies) => {
  if (!Array.isArray(movies)) return [];
  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title || movie.name || movie.original_title || movie.original_name,
    poster_path: movie.poster_path,
    overview: movie.overview,
    backdrop_path: movie.backdrop_path,
    media_type: movie.media_type || (movie.first_air_date || movie.name ? 'tv' : 'movie'),
  }));
};

// extractor for movie and TV series details
export const simplifyMovieDetails = (movie) => ({
  id: movie.id,
  title: movie.title || movie.name || movie.original_title || movie.original_name,
  tagline: movie.tagline,
  release_date: movie.release_date || movie.first_air_date,
  overview: movie.overview,
  poster_path: movie.poster_path,
  backdrop_path: movie.backdrop_path,
  vote_average: movie.vote_average,
  genre_ids: movie.genres,
  number_of_seasons: movie.number_of_seasons,
  number_of_episodes: movie.number_of_episodes,
  seasons: movie.seasons
    ? movie.seasons.map((s) => ({
        id: s.id,
        season_number: s.season_number,
        name: s.name,
        episode_count: s.episode_count,
        poster_path: s.poster_path,
      }))
    : undefined,
  media_type: movie.number_of_seasons || movie.first_air_date || movie.name ? 'tv' : 'movie',
});

export const simplifySeriesData = simplifyMovieData;
export const simplifySeriesDetails = simplifyMovieDetails;

