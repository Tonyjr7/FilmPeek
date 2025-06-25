import { BookmarkIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WatchlistModal from './WatchlistModal';
import {
  addToFavorite,
  addToWatchList,
  fetchFavorites,
  removeFromFavorite,
  movieTrailer,
} from '../utils/api';

export default function MovieModal({
  movie,
  onClose,
  similarMovies,
  onMovieSelect,
}) {
  const auth_token = localStorage.getItem('token');
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [player, setPlayer] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await fetchFavorites(auth_token);
        const favoriteIds = res.data.data;
        setFavorites(favoriteIds);
        setIsFavorite(favoriteIds.includes(movie.id));
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      }
    };
    loadFavorites();
  }, [auth_token, movie.id]);

  const handlePlayTrailer = async () => {
    if (!movie?.id) return;
    try {
      const trailerRes = await movieTrailer(movie.id);
      const trailerKey = trailerRes.data.message;
      setTrailerKey(trailerKey);
      setShowTrailer(true);
    } catch (err) {
      console.error('Error fetching trailer:', err);
    }
  };

  useEffect(() => {
    if (!showTrailer || !trailerKey) return;

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
      const newPlayer = new window.YT.Player('modal-trailer', {
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
  }, [showTrailer, trailerKey]);

  useEffect(() => {
    if ((showWatchlistModal || !movie) && player) {
      player.pauseVideo?.();
    }
  }, [showWatchlistModal, movie, player]);

  const unmuteVideo = () => {
    const iframe = document.getElementById('modal-trailer');
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
    handlePlayTrailer();
    setTimeout(() => {
      unmuteVideo(); // ensure iframe is loaded
    }, 2000);
  };

  const handleToggleFavorite = async (movieId) => {
    try {
      if (isFavorite) {
        await removeFromFavorite(movieId, auth_token);
        setIsFavorite(false);
        setTimeout(() => navigate('/'), 100);
      } else {
        await addToFavorite(movieId, auth_token);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleSelectWatchlist = async (watchlistId) => {
    try {
      await addToWatchList(movie.id, watchlistId, auth_token);
      alert(`Movie added to watchlist!`);
    } catch (err) {}
    setShowWatchlistModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
        <div className="bg-black rounded-2xl relative shadow-xl text-white overflow-y-auto max-h-[90vh] w-full max-w-[95vw] md:max-w-5xl no-scrollbar">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition z-10"
            onClick={onClose}
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          <div className="relative w-full aspect-video">
            {showTrailer && trailerKey ? (
              <>
                <iframe
                  id="modal-trailer"
                  className="absolute top-0 left-0 w-full h-full rounded-t-2xl"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&origin=${window.location.origin}&showinfo=0&disablekb=1`}
                  title="Trailer"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  frameBorder="0"
                />
              </>
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover rounded-t-2xl"
              />
            )}
          </div>

          <div className="relative bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-8">
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-4">
              {movie.title}
            </h2>

            <div className="flex items-center gap-4 sm:gap-6 sm:flex-wrap">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-4 py-2 text-sm md:text-lg h-[48px] sm:h-[60px] rounded-md bg-red-600 text-white font-semibold hover:bg-red-500 transition"
              >
                ▶ Play Trailer
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

            <div className="mt-4 w-full">
              <button
                onClick={() => setShowWatchlistModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm md:text-lg h-[48px] sm:h-[60px] rounded-md bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
              >
                <BookmarkIcon className="w-5 h-5 md:w-6 md:h-6" />
                <span>Add To Watchlist</span>
              </button>
            </div>
          </div>

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

            {similarMovies?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-4xl font-bold text-white mb-4">
                  Similar Movies
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {similarMovies.map((similar) => (
                    <div
                      key={similar.id}
                      onClick={() => {
                        setShowTrailer(false);
                        setTrailerKey(null);
                        if (player && player.stopVideo) {
                          player.stopVideo();
                        }
                        onMovieSelect(similar.id);
                      }}
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

      {showWatchlistModal && (
        <WatchlistModal
          onClose={() => setShowWatchlistModal(false)}
          onSelectWatchlist={handleSelectWatchlist}
          movieId={movie.id}
        />
      )}
    </>
  );
}
