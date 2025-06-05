// extractor for movie data
export const simplifyMovieData = (movies) => {
  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title || movie.original_title,
    poster_path: movie.poster_path,
  }));
};

// extractor for movie details
export const simplifyMovieDetails = (movie) => ({
  id: movie.id,
  title: movie.title || movie.original_title,
  tagline: movie.tagline,
  release_date: movie.release_date,
  overview: movie.overview,
  poster_path: movie.poster_path,
  backdrop_path: movie.backdrop_path,
  vote_average: movie.vote_average,
  genre_ids: movie.genres,
});
