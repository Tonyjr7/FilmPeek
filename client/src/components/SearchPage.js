import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieModal from './MovieModal';
import {
  getMovieDetails,
  getSimilarMovies,
  getSeriesDetails,
  getSimilarSeries,
} from '../utils/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const [searchTerm, setSearchTerm] = useState(query.get('q') || '');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'movies', 'series'
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const term = encodeURIComponent(searchTerm.trim());

      try {
        let results = [];
        if (activeTab === 'movies') {
          const res = await fetch(`${baseUrl}/movie/search?name=${term}`).then((r) => r.json());
          results = (Array.isArray(res) ? res : []).map((m) => ({ ...m, media_type: 'movie' }));
        } else if (activeTab === 'series') {
          const res = await fetch(`${baseUrl}/series/search?name=${term}`).then((r) => r.json());
          results = (Array.isArray(res) ? res : []).map((m) => ({ ...m, media_type: 'tv' }));
        } else {
          // 'all' tab - fetch both
          const [movieRes, seriesRes] = await Promise.all([
            fetch(`${baseUrl}/movie/search?name=${term}`).then((r) => r.json()).catch(() => []),
            fetch(`${baseUrl}/series/search?name=${term}`).then((r) => r.json()).catch(() => []),
          ]);

          const movieItems = (Array.isArray(movieRes) ? movieRes : []).map((m) => ({
            ...m,
            media_type: 'movie',
          }));
          const seriesItems = (Array.isArray(seriesRes) ? seriesRes : []).map((s) => ({
            ...s,
            media_type: 'tv',
          }));

          // Interleave results
          const combined = [];
          const maxLen = Math.max(movieItems.length, seriesItems.length);
          for (let i = 0; i < maxLen; i++) {
            if (i < movieItems.length) combined.push(movieItems[i]);
            if (i < seriesItems.length) combined.push(seriesItems[i]);
          }
          results = combined;
        }

        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, activeTab]);

  const handleMoreInfoClick = async (mediaId, mediaType = 'movie') => {
    try {
      const isTv = mediaType === 'tv';
      const res = isTv ? await getSeriesDetails(mediaId) : await getMovieDetails(mediaId);
      setSelectedMovie({ ...res.data, media_type: isTv ? 'tv' : 'movie' });

      const relatedRes = isTv
        ? await getSimilarSeries(mediaId)
        : await getSimilarMovies(mediaId);
      setRelatedMovies(relatedRes.data.results || []);
    } catch (err) {
      console.error('Failed to fetch media details:', err);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRelatedMovies([]);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for movies or TV series..."
            className="w-full sm:w-1/2 p-3 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-gray-400"
          />

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
            {['all', 'movies', 'series'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
                  activeTab === tab
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'movies' ? 'Movies' : 'TV Series'}
              </button>
            ))}
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold mb-8">
          Search results for{' '}
          <span className="text-amber-400">"{searchTerm}"</span>
        </h1>

        {loading && (
          <p className="text-amber-300 text-lg animate-pulse">
            Searching for titles...
          </p>
        )}

        {!loading && searchResults.length === 0 && searchTerm && (
          <p className="text-red-400 text-lg mt-6">
            No titles found. Try a different keyword.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          {searchResults.map((item) => (
            <div
              key={`${item.media_type}-${item.id}`}
              onClick={() => handleMoreInfoClick(item.id, item.media_type)}
              className="cursor-pointer rounded-xl overflow-hidden bg-white/5 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 transition-transform relative group"
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : '/placeholder.png'
                }
                alt={item.title}
                className="w-full h-72 object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/70 backdrop-blur text-xs font-semibold px-2 py-1 rounded border border-white/20 text-amber-400">
                {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
              </span>
              <div className="p-3">
                <h2 className="text-sm font-medium truncate">{item.title}</h2>
              </div>
            </div>
          ))}
        </div>

        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            similarMovies={relatedMovies}
            onClose={closeModal}
            onMovieSelect={(id) =>
              handleMoreInfoClick(id, selectedMovie.media_type || 'movie')
            }
          />
        )}
      </div>
    </div>
  );
}
