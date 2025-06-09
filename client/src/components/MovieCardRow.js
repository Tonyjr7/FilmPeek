import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieModal from './MovieModal';
import { getMovieDetails, getSimilarMovies } from '../utils/api';

export default function MovieCardRow({ title, endpoint }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  const auth_token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${auth_token}`,
          },
        });
        setMovies(res.data || []);
      } catch (err) {
        console.error('Error loading movies:', err);
      }
    };
    fetchMovies();
  }, [endpoint]);

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
    <div className="w-full mb-10 px-4 md:px-20 mt-6">
      <h2 className="text-white text-2xl font-semibold mb-4">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2 pt-2">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMoreInfoClick(movie.id)}
            className="w-[215px] h-[322px] flex-shrink-0 bg-zinc-800 rounded-md overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
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
