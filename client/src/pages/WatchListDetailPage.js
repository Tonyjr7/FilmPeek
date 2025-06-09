import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieModal from '../components/MovieModal';
import {
  fetchWatchList,
  getMovieDetails,
  getSimilarMovies,
} from '../utils/api';

export default function WatchlistDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  const auth_token = localStorage.getItem('token');

  useEffect(() => {
    const fetchWatchlistAndMovies = async () => {
      try {
        // Fetch watchlist (with movie IDs)
        const res = await fetchWatchList(id);
        const watchlistData = res.data.watchlist;
        setWatchlist(watchlistData);

        if (watchlistData.movies.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }

        // Fetch full details for each movie ID
        const movieDetails = await Promise.all(
          watchlistData.movies.map((movieId) =>
            getMovieDetails(movieId)
              .then((res) => res.data)
              .catch(() => null),
          ),
        );

        // Filter out any null (failed) fetches
        setMovies(movieDetails.filter(Boolean));
      } catch (err) {
        setError('Failed to load watchlist or movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistAndMovies();
  }, [id, auth_token]);

  const handleMoreInfoClick = async (movieId) => {
    try {
      const [res, relatedRes] = await Promise.all([
        getMovieDetails(movieId),
        getSimilarMovies(movieId),
      ]);

      setSelectedMovie(res.data);
      setRelatedMovies(relatedRes.data.results || []);
    } catch (err) {
      console.error('Failed to fetch movie details or similar movies:', err);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRelatedMovies([]);
  };

  if (loading)
    return <p className="text-center text-white mt-20">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;
  if (!watchlist)
    return <p className="text-center text-white mt-20">Watchlist not found.</p>;

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-10 md:px-20 py-10 mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-amber-600 hover:bg-yellow-500 rounded"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-8">{watchlist.name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.length === 0 ? (
          <p className="text-center col-span-full text-gray-400">
            No movies in this watchlist.
          </p>
        ) : (
          movies.map((movie) => (
            <div
              key={movie.id || movie._id}
              onClick={() => handleMoreInfoClick(movie.id || movie._id)}
              className="bg-zinc-800 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </div>
          ))
        )}
      </div>
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          similarMovies={relatedMovies}
          onClose={closeModal}
          onMovieSelect={handleMoreInfoClick}
        />
      )}
    </div>
  );
}
