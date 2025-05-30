export const simplifyMovieData = (movies) => {
  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title || movie.original_title,
    release_date: movie.release_date,
    overview: movie.overview,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    popularity: movie.popularity,
    genre_ids: movie.genre_ids,
    language: movie.original_language,
    adult: movie.adult,
  }));
};

// extractor for movie data
export const simplifyMovieDetails = (movie) => ({
  id: movie.id,
  title: movie.title || movie.original_title,
  tagline: movie.tagline,
  release_date: movie.release_date,
  overview: movie.overview,
  poster_path: movie.poster_path,
  vote_average: movie.vote_average,
  genre_ids: movie.genres,
});
