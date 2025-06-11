import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MovieModal from './MovieModal';
import { getMovieDetails, getSimilarMovies } from '../utils/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const [searchTerm, setSearchTerm] = useState(query.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/movie/search?name=${encodeURIComponent(searchTerm)}`,
      )
        .then((res) => res.json())
        .then((data) => setSearchResults(Array.isArray(data) ? data : []))
        .catch(() => setSearchResults([]))
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleMoreInfoClick = async (movieId) => {
    try {
      const res = await getMovieDetails(movieId);
      setSelectedMovie(res.data);

      const relatedRes = await getSimilarMovies(movieId);
      setRelatedMovies(relatedRes.data.results || []);
    } catch (err) {
      console.error('Failed to fetch movie details or similar movies:', err);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRelatedMovies([]);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a movie..."
            className="w-full sm:w-1/2 p-3 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-8">
          Search results for{' '}
          <span className="text-yellow-400">"{searchTerm}"</span>
        </h1>

        {loading && (
          <p className="text-yellow-300 text-lg animate-pulse">
            Searching for movies...
          </p>
        )}

        {!loading && searchResults.length === 0 && searchTerm && (
          <p className="text-red-400 text-lg mt-6">
            No movies found. Try a different keyword.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10">
          {searchResults.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMoreInfoClick(movie.id)}
              className="cursor-pointer rounded-xl overflow-hidden bg-white/5 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 transition-transform"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/placeholder.png'
                }
                alt={movie.title}
                className="w-full h-72 object-cover"
              />
              <div className="p-3">
                <h2 className="text-sm font-medium truncate">{movie.title}</h2>
              </div>
            </div>
          ))}
          {selectedMovie && (
            <MovieModal
              movie={selectedMovie}
              similarMovies={relatedMovies}
              onClose={closeModal}
              onMovieSelect={handleMoreInfoClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
