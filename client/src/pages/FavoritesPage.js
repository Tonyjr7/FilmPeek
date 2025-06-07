import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieModal from '../components/MovieModal';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]); // will hold full movie details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  const auth_token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // 1. Get array of favorite movie IDs
        const res = await axios.get(
          'http://192.168.0.129:5000/api/movie/user/favorites',
          {
            headers: {
              Authorization: `Bearer ${auth_token}`,
            },
          },
        );

        const favoriteIds = res.data.data; // e.g. [575265, 1001414]

        // 2. Fetch details for each favorite movie ID in parallel
        const detailsRequests = favoriteIds.map((id) =>
          axios.get(`http://192.168.0.129:5000/api/movie/${id}`),
        );

        const detailsResponses = await Promise.all(detailsRequests);

        // 3. Extract data from each response
        const movies = detailsResponses.map((resp) => resp.data);
        // assuming your movie detail response shape is { data: {...movieDetails} }

        setFavorites(movies);
      } catch (err) {
        setError('You need to be logged in.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [auth_token]);

  const handleMoreInfoClick = async (movieId) => {
    try {
      const res = await fetch(`http://192.168.0.129:5000/api/movie/${movieId}`);
      const data = await res.json();
      setSelectedMovie(data);

      const relatedRes = await fetch(
        `http://192.168.0.129:5000/api/movie/${movieId}/similar`,
      );
      const relatedData = await relatedRes.json();
      setRelatedMovies(relatedData.results || []);
    } catch (err) {
      console.error('Failed to fetch movie details or similar movies:', err);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRelatedMovies([]);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-10 md:px-20 py-10">
      <div className="max-w-7xl mx-auto mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-left">
          Your Favorites
        </h1>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.length === 0 ? (
              <p className="text-center col-span-full text-gray-400">
                No favorites yet.
              </p>
            ) : (
              favorites.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleMoreInfoClick(item.id)}
                  className="bg-zinc-800 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))
            )}
          </div>
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
