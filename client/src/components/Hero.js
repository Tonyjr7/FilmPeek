import { useEffect, useState } from 'react';
import {
  BookmarkIcon,
  InformationCircleIcon,
  PlayIcon,
} from '@heroicons/react/24/solid';
import MovieModal from './MovieModal';
import WatchlistModal from './WatchlistModal';
import {
  getTrendingMovies,
  getMovieDetails,
  getSimilarMovies,
  movieTrailer,
} from '../utils/api';

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [player, setPlayer] = useState(null);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTrendingMovies();
        const firstMovie = res.data[0];
        setMovie(firstMovie);
      } catch (err) {
        console.error('Error loading movie:', err);
      }
    };
    fetchData();
  }, []);

  const handlePlayTrailer = async () => {
    if (!movie?.id) return;
    try {
      const trailerRes = await movieTrailer(movie.id);
      const trailerKey = trailerRes.data.message;
      setMovie((prev) => ({ ...prev, trailerKey }));
      setShowTrailer(true);
    } catch (err) {
      console.error('Error fetching trailer:', err);
    }
  };

  useEffect(() => {
    if (!showTrailer || !movie?.trailerKey) return;

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      } else {
        createPlayer();
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    const createPlayer = () => {
      const newPlayer = new window.YT.Player('trailer-player', {
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setShowTrailer(false);
            }
          },
        },
      });
      setPlayer(newPlayer);
    };

    loadYouTubeAPI();

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [showTrailer, movie?.trailerKey]);

  useEffect(() => {
    if ((selectedMovie || showWatchlistModal) && player) {
      player.pauseVideo();
    }
  }, [selectedMovie, showWatchlistModal, player]);

  const handleMoreInfoClick = async (movieId) => {
    setIsLoadingModal(true);
    try {
      const res = await getMovieDetails(movieId);
      setSelectedMovie(res.data);
      const relatedRes = await getSimilarMovies(movieId);
      setRelatedMovies(relatedRes.data.results || []);
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
    } finally {
      setIsLoadingModal(false);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRelatedMovies([]);
    if (player && showTrailer) {
      player.playVideo();
    }
  };

  const handleCloseWatchlist = () => {
    setShowWatchlistModal(false);
    if (player && showTrailer) {
      player.playVideo();
    }
  };

  const handleSelectWatchlist = (watchlistId) => {
    alert(`Add movie ${movie.id} to watchlist ${watchlistId}`);
    setShowWatchlistModal(false);
  };

  const unmuteVideo = () => {
    const iframe = document.getElementById('trailer-player');
    if (!iframe) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'unMute',
        args: [],
      }),
      '*',
    );
  };

  const handlePlay = () => {
    setShowTrailer(true);
    handlePlayTrailer();
    setTimeout(() => {
      unmuteVideo(); // Unmute after player loads
    }, 5000); // Delay a bit to ensure iframe is ready
  };

  if (!movie) return null;

  return (
    <>
      {isLoadingModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-white border-t-red-500 rounded-full animate-spin" />
        </div>
      )}
      <div className="relative h-[90vh] w-full bg-black text-white">
        {showTrailer && movie.trailerKey ? (
          <>
            <iframe
              id="trailer-player"
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              frameBorder="0"
            />
          </>
        ) : (
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            }}
          />
        )}

        <div className="relative z-10 flex items-center h-full px-4 md:px-20">
          <div className="max-w-2xl space-y-6 mt-[-10px]">
            <h1 className="text-4xl md:text-6xl font-black drop-shadow-lg">
              {movie.title}
            </h1>
            <p className="text-base md:text-xl line-clamp-3 max-w-[352px] md:max-w-[500px] h-[73px] md:h-[87px] md:leading-[1.5]">
              {movie.overview}
            </p>
            <div className="mt-6 flex flex-row flex-wrap gap-2">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-4 py-2 text-sm md:text-lg h-[60px] rounded-md bg-red-600 text-white font-semibold hover:bg-red-500 transition"
              >
                <PlayIcon className="h-5 md:h-8 w-5 md:w-8" />
                <span>Play Trailer</span>
              </button>
              <button
                onClick={() => setShowWatchlistModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm md:text-lg h-[60px] rounded-md bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
              >
                <BookmarkIcon className="md:w-8 md:h-8 h-5" />
                <span>Add To Watchlist</span>
              </button>
              <button
                onClick={() => handleMoreInfoClick(movie.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm md:text-lg h-[60px] rounded-md bg-white opacity-50 text-black font-semibold hover:bg-gray-400 transition"
              >
                <InformationCircleIcon className="md:w-8 md:h-8 h-5" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showWatchlistModal && (
        <WatchlistModal
          onClose={handleCloseWatchlist}
          onSelectWatchlist={handleSelectWatchlist}
          movieId={movie.id}
        />
      )}

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
