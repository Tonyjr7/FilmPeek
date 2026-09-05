import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InformationCircleIcon, PlayIcon } from '@heroicons/react/24/solid';
import MovieModal from './MovieModal';
import {
  getTrendingMovies,
  getMovieDetails,
  getSimilarMovies,
  getTrendingSeries,
  getSeriesDetails,
  getSimilarSeries,
} from '../utils/api';

const Hero = ({ mediaType = 'movie' }) => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isTv = mediaType === 'tv';
        const res = isTv ? await getTrendingSeries() : await getTrendingMovies();
        const firstItem = res.data[0];
        setMovie(firstItem ? { ...firstItem, media_type: isTv ? 'tv' : 'movie' } : null);
      } catch (err) {
        console.error('Error loading hero item:', err);
      }
    };
    fetchData();
  }, [mediaType]);

  const handleMoreInfoClick = async (movieId) => {
    setIsLoadingModal(true);
    try {
      const isTv = mediaType === 'tv' || movie?.media_type === 'tv';
      const res = isTv ? await getSeriesDetails(movieId) : await getMovieDetails(movieId);
      setSelectedMovie({ ...res.data, media_type: isTv ? 'tv' : 'movie' });
      const relatedRes = isTv ? await getSimilarSeries(movieId) : await getSimilarMovies(movieId);
      setRelatedMovies(relatedRes.data.results || []);
    } catch (err) {
      console.error('Failed to fetch media details:', err);
    } finally {
      setIsLoadingModal(false);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRelatedMovies([]);
  };

  if (!movie) return null;

  return (
    <>
      {isLoadingModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-white border-t-amber-500 rounded-full animate-spin" />
        </div>
      )}
      <div className="relative h-[90vh] w-full bg-black text-white">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        />

        <div className="relative z-10 flex items-center h-full px-4 md:px-20">
          <div className="max-w-2xl space-y-6 mt-[-10px]">
            <h1 className="text-4xl md:text-6xl font-black drop-shadow-lg">
              {movie.title}
            </h1>
            <p className="text-base md:text-xl line-clamp-3 max-w-[352px] md:max-w-[500px] h-[73px] md:h-[87px] md:leading-[1.5]">
              {movie.overview}
            </p>
            <div className="mt-6 flex flex-row flex-wrap gap-3">
              <button
                onClick={() =>
                  navigate(
                    mediaType === 'tv' || movie.media_type === 'tv'
                      ? `/watch/tv/${movie.id}`
                      : `/watch/${movie.id}`
                  )
                }
                className="flex items-center gap-2 px-5 py-3 text-sm md:text-lg rounded-md bg-red-600 text-white font-semibold hover:bg-red-500 transition shadow-lg"
              >
                <PlayIcon className="h-5 md:h-7 w-5 md:w-7" />
                <span>Watch Video</span>
              </button>

              <button
                onClick={() => handleMoreInfoClick(movie.id)}
                className="flex items-center gap-2 px-5 py-3 text-sm md:text-lg rounded-md bg-zinc-700/80 text-white font-semibold hover:bg-zinc-600 transition shadow-lg backdrop-blur"
              >
                <InformationCircleIcon className="h-5 md:h-7 w-5 md:w-7" />
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
