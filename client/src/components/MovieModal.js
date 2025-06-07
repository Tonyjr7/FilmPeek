import { BookmarkIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieModal({
  movie,
  onClose,
  similarMovies,
  onMovieSelect,
}) {
  const auth_token = localStorage.getItem('token');
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          'http://192.168.0.129:5000/api/movie/user/favorites',
          { headers: { Authorization: `Bearer ${auth_token}` } },
        );
        const favoriteIds = res.data.data;
        setFavorites(favoriteIds);
        setIsFavorite(favoriteIds.includes(movie.id));
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      }
    };
    fetchFavorites();
  }, [auth_token, movie.id]);

  // Toggle favorite status
  const handleToggleFavorite = async (movieId) => {
    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.post(
          'http://192.168.0.129:5000/api/movie/user/favorites/remove',
          { movieId },
          { headers: { Authorization: `Bearer ${auth_token}` } },
        );
        setIsFavorite(false);
        setTimeout(() => navigate('/'), 100);
      } else {
        // Add to favorites
        await axios.post(
          'http://192.168.0.129:5000/api/movie/user/favorites/add',
          { movieId },
          { headers: { Authorization: `Bearer ${auth_token}` } },
        );
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-black rounded-2xl relative shadow-xl text-white overflow-y-auto max-h-[90vh] w-full max-w-[95vw] md:max-w-5xl no-scrollbar">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition z-10"
          onClick={onClose}
        >
          <XMarkIcon className="w-8 h-8" />
        </button>

        {movie.backdrop_path && (
          <div className="relative w-full">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full object-cover rounded-t-2xl"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-8 rounded-b-2xl">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-4">
                {movie.title}
              </h2>
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 px-4 py-2 text-sm md:text-lg h-[48px] sm:h-[60px] rounded-md bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
                  <BookmarkIcon className="w-5 h-5 md:w-8 md:h-8" />
                  <span>Add To Watchlist</span>
                </button>
                <button
                  onClick={() => handleToggleFavorite(movie.id)}
                  className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition ${
                    isFavorite
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/40 text-white hover:bg-white/20'
                  }`}
                >
                  <StarIcon className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 mt-1">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3 space-y-4">
              {movie.tagline && (
                <h4 className="text-lg font-semibold text-gray-300 mt-6">
                  {movie.tagline}
                </h4>
              )}
              <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
                {movie.overview}
              </p>
            </div>

            <div className="md:w-1/3">
              <h4 className="text-lg font-semibold text-gray-400 mt-4">
                Genres
              </h4>
              <ul className="mt-2 space-y-1 text-lg font-semibold text-white-400">
                {movie.genre_ids?.map((genre) => (
                  <li key={genre.id}>• {genre.name}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Similar Movies Section */}
          {similarMovies?.length > 0 && (
            <div className="mt-10">
              <h3 className="text-4xl font-bold text-white mb-4">
                Similar Movies
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarMovies.map((similar) => (
                  <div
                    key={similar.id}
                    onClick={() => onMovieSelect(similar.id)}
                    className="bg-zinc-800 h-80 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${similar.poster_path}`}
                      alt={similar.title}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
