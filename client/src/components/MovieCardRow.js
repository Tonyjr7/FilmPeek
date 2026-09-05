import { useEffect, useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import api, {
  getMovieDetails,
  getSimilarMovies,
  getSeriesDetails,
  getSimilarSeries,
} from '../utils/api';
import MovieModal from './MovieModal';

export default function MovieCardRow({ title, endpoint, mediaType = 'movie' }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMovies = async () => {
      try {
        const res = await api.get(endpoint);
        if (isMounted) {
          setMovies(res.data || []);
        }
      } catch (err) {
        console.error('Error loading media:', err);
      }
    };

    if (endpoint) {
      fetchMovies();
    }

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll =
        direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const handleMoreInfoClick = async (mediaId, itemType = mediaType) => {
    try {
      const isTv = itemType === 'tv';
      const detailsReq = isTv ? getSeriesDetails(mediaId) : getMovieDetails(mediaId);
      const similarReq = isTv ? getSimilarSeries(mediaId) : getSimilarMovies(mediaId);

      const [res, relatedRes] = await Promise.all([
        detailsReq.catch(() => ({ data: {} })),
        similarReq.catch(() => ({ data: { results: [] } })),
      ]);

      setSelectedMovie({ ...res.data, media_type: isTv ? 'tv' : 'movie' });
      setRelatedMovies(relatedRes.data?.results || []);
    } catch (err) {
      console.error('Failed to fetch media details:', err);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRelatedMovies([]);
  };

  return (
    <div className="w-full mb-10 px-4 md:px-20 mt-6">
      <h2 className="text-white text-2xl font-semibold mb-4">{title}</h2>

      <div className="relative group">
        {/* Left Chevron Button */}
        <button
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-amber-500 hover:text-black text-white p-3 rounded-r-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center border-y border-r border-white/20"
        >
          <ChevronLeftIcon className="w-7 h-7" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth pb-2 pt-2"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMoreInfoClick(movie.id, movie.media_type || mediaType)}
              className="w-[215px] h-[322px] flex-shrink-0 bg-zinc-800 rounded-md overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/placeholder.png'
                }
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Right Chevron Button */}
        <button
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-amber-500 hover:text-black text-white p-3 rounded-l-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center border-y border-l border-white/20"
        >
          <ChevronRightIcon className="w-7 h-7" />
        </button>
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          similarMovies={relatedMovies}
          onClose={closeModal}
          onMovieSelect={(id) => handleMoreInfoClick(id, selectedMovie.media_type || mediaType)}
        />
      )}
    </div>
  );
}


