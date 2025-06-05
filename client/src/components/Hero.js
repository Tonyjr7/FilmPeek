import { useEffect, useState } from 'react';
import { BookmarkIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import MovieModal from './MovieModal';

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      const res = await fetch(`http://192.168.0.129:5000/api/movie/trending`);
      const data = await res.json();
      setMovie(data.results[0]);
    };
    fetchPopular();
  }, []);

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

  if (!movie) return null;

  return (
    <>
      <div
        className="relative h-[90vh] w-full bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute to-transparent"></div>
        <div className="relative z-10 flex items-center h-full px-4 md:px-20">
          <div className="max-w-2xl space-y-6 mt-[-10px]">
            <h1 className="text-4xl md:text-6xl font-black drop-shadow-lg">
              {movie.title}
            </h1>
            <p className="text-base md:text-xl line-clamp-3 max-w-[352px] md:max-w-[500px] h-[73px] md:h-[87px] md:leading-[1.5]">
              {movie.overview}
            </p>
            <div className="mt-6 flex flex-row flex-wrap gap-2">
              <button className="flex-shrink flex items-center gap-2 px-4 py-2 text-sm md:text-lg h-[60px] rounded-md bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
                <BookmarkIcon className="md:w-8 md:h-8 h-5" />
                <span>Add To Watchlist</span>
              </button>
              <button
                onClick={() => handleMoreInfoClick(movie.id)}
                className="flex-shrink flex items-center gap-2 px-4 py-2 text-sm md:text-lg h-[60px] rounded-md bg-white opacity-50 text-black font-semibold hover:bg-gray-400 transition"
              >
                <InformationCircleIcon className="md:w-8 md:h-8 h-5" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          similarMovies={relatedMovies}
          onClose={closeModal}
          onMovieSelect={handleMoreInfoClick}
        />
      )}
    </>
  );
};

export default Hero;
