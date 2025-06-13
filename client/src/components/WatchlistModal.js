import { BookmarkIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getWatchlists, createWatchlist, addToWatchList } from '../utils/api';
import Toast from './Toast';

export default function WatchlistModal({
  onClose,
  onSelectWatchlist,
  movieId,
}) {
  const auth_token = localStorage.getItem('token');
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [addingMovie, setAddingMovie] = useState(false);
  const [toast, setToast] = useState(null); // toast state {message, type}

  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const res = await getWatchlists();
        if (Array.isArray(res.data.watchlists)) {
          setWatchlists(res.data.watchlists);
        } else {
          setWatchlists([]);
        }
      } catch (err) {
        setWatchlists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlists();
  }, [auth_token]);

  const handleCreateWatchlist = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await createWatchlist(newName, auth_token);
      if (res.data.watchlist) {
        setWatchlists((prev) => [...prev, res.data.watchlist]);
      }
      setNewName('');
      setAddingNew(false);
    } catch {
      setToast({
        message: 'Error creating watchlist watchlist',
        type: 'error',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleAddMovie = async (watchlistId) => {
    if (!movieId) {
      setToast({ message: 'No movie selected', type: 'error' });
      return;
    }
    setAddingMovie(true);
    try {
      await addToWatchList(movieId, watchlistId, auth_token);
      setToast({ message: 'Movie added to wtahclist', type: 'success' });
      onSelectWatchlist(watchlistId);
      onClose();
    } catch (err) {
      setToast({ message: 'An error occured', type: 'error' });
    } finally {
      setAddingMovie(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 text-white shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Watchlists</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close watchlist modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="max-h-64 overflow-y-auto mb-4">
            {watchlists.length === 0 ? (
              <li className="text-gray-400">No watchlists found.</li>
            ) : (
              watchlists.map((wl, i) => (
                <li
                  key={wl?._id ?? i}
                  onClick={() =>
                    !addingMovie && wl?._id && handleAddMovie(wl._id)
                  }
                  className={`cursor-pointer px-3 py-2 rounded hover:bg-amber-600 transition ${
                    addingMovie ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {wl?.name ?? 'Unnamed Watchlist'}
                </li>
              ))
            )}
          </ul>
        )}

        {addingNew ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New watchlist name"
              className="flex-grow rounded px-3 py-2 text-black"
              disabled={creating}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateWatchlist();
              }}
            />
            <button
              onClick={handleCreateWatchlist}
              disabled={creating}
              className="bg-amber-500 hover:bg-amber-400 rounded px-4 py-2 text-black font-semibold transition"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingNew(true)}
            className="flex items-center justify-center gap-2 w-full py-2 bg-amber-500 hover:bg-amber-400 rounded text-black font-semibold transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Watchlist
          </button>
        )}
      </div>
      {/* Toast component rendered here */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
