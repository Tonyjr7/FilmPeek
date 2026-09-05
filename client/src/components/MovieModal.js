import {
  BookmarkIcon,
  XMarkIcon,
  StarIcon,
  EyeIcon,
  PlayIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WatchlistModal from './WatchlistModal';
import RecommendationExplanation from './RecommendationExplanation';
import {
  addToFavorite,
  addToWatchList,
  fetchFavorites,
  removeFromFavorite,
  movieTrailer,
  seriesTrailer,
  getSeriesSeasonDetails,
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

  const isTv = movie?.media_type === 'tv' || !!movie?.number_of_seasons;
  const seasonsList = movie?.seasons?.filter((s) => s.season_number > 0) || [];
  const defaultSeason = seasonsList.length > 0 ? seasonsList[0].season_number : 1;

  const [selectedSeason, setSelectedSeason] = useState(defaultSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  useEffect(() => {
    if (!isTv || !movie?.id) return;
    const fetchEpisodes = async () => {
      setEpisodesLoading(true);
      try {
        const res = await getSeriesSeasonDetails(movie.id, selectedSeason);
        setEpisodes(res.data.episodes || []);
      } catch (err) {
        console.error('Failed to fetch season episodes:', err);
        setEpisodes([]);
      } finally {
        setEpisodesLoading(false);
      }
    };
    fetchEpisodes();
  }, [isTv, movie?.id, selectedSeason]);

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
      const isTv = movie.media_type === 'tv' || !!movie.number_of_seasons;
      const trailerRes = isTv ? await seriesTrailer(movie.id).catch(() => movieTrailer(movie.id)) : await movieTrailer(movie.id);
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

  const handlePlayMovie = (movieId, seasonNum = selectedSeason, epNum = selectedEpisode) => {
    if (isTv) {
      navigate(`/watch/tv/${movieId}?s=${seasonNum}&e=${epNum}`);
    } else {
      navigate(`/watch/${movieId}`);
    }
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

            <div className="flex items-center gap-3 sm:gap-3 sm:flex-wrap">
              <button
                onClick={() => handlePlayMovie(movie.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm md:text-lg h-[48px] sm:h-[60px] rounded-md bg-red-600 text-white font-semibold hover:bg-red-500 transition"
              >
                <PlayIcon className="w-5 h-5 md:w-6 md:h-6" />
                <span>Play</span>
              </button>
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-4 py-2 text-sm md:text-lg h-[48px] sm:h-[60px] rounded-md bg-blue-600 text-white font-semibold hover:bg-red-500 transition"
              >
                <EyeIcon className="w-5 h-5 md:w-6 md:h-6" />
                <span>Peek</span>
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
                {movie.number_of_seasons && (
                  <div className="flex gap-4 text-sm text-amber-400 font-semibold">
                    <span>{movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? 's' : ''}</span>
                    {movie.number_of_episodes && <span>• {movie.number_of_episodes} Episodes</span>}
                  </div>
                )}
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

            {/* Seasons & Episodes Section */}
            {isTv && (
              <div className="mt-8 border-t border-zinc-800 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>Episodes</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-medium">
                      {episodes.length} Episodes
                    </span>
                  </h3>
                  {seasonsList.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-400 font-medium">Season:</label>
                      <select
                        value={selectedSeason}
                        onChange={(e) => {
                          setSelectedSeason(Number(e.target.value));
                          setSelectedEpisode(1);
                        }}
                        className="bg-zinc-800 text-white font-semibold px-4 py-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-sm"
                      >
                        {seasonsList.map((s) => (
                          <option key={s.id || s.season_number} value={s.season_number}>
                            {s.name || `Season ${s.season_number}`} ({s.episode_count} eps)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {episodesLoading ? (
                  <div className="py-10 text-center text-amber-400 animate-pulse">
                    Loading season episodes...
                  </div>
                ) : episodes.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No episodes available for this season.</p>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {episodes.map((ep) => (
                      <div
                        key={ep.id}
                        onClick={() => {
                          setSelectedEpisode(ep.episode_number);
                          handlePlayMovie(movie.id, selectedSeason, ep.episode_number);
                        }}
                        className="flex flex-col sm:flex-row gap-4 p-3 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 transition cursor-pointer group border border-zinc-800 hover:border-amber-500/50"
                      >
                        <div className="relative w-full sm:w-44 h-28 flex-shrink-0 bg-zinc-800 rounded-md overflow-hidden">
                          <img
                            src={
                              ep.still_path
                                ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                                : movie.backdrop_path
                                ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
                                : '/placeholder.png'
                            }
                            alt={ep.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition">
                            <PlayIcon className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 rounded border border-amber-500/30">
                            S{selectedSeason} E{ep.episode_number}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-base font-semibold text-white group-hover:text-amber-400 transition">
                              {ep.episode_number}. {ep.name}
                            </h4>
                            {ep.runtime && (
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {ep.runtime} min
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-light leading-relaxed">
                            {ep.overview || 'No overview available for this episode.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AI-powered recommendation explanation */}
            <RecommendationExplanation movie={movie} />

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
