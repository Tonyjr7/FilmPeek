import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  fetchWatchLists,
  getMovieDetails,
  removeWatchList,
} from '../utils/api';

export default function WatchListPage() {
  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const auth_token = localStorage.getItem('token');

  useEffect(() => {
    const fetchWatchList = async () => {
      try {
        const res = await fetchWatchLists(auth_token);

        const rawLists = res.data.watchlists;

        const updatedLists = await Promise.all(
          rawLists.map(async (list) => {
            const movieDetails = await Promise.all(
              list.movies.map(async (id) => {
                const res = await getMovieDetails(id);
                return res.data;
              }),
            );
            return { ...list, movies: movieDetails };
          }),
        );

        setWatchList(updatedLists);
      } catch (err) {
        setError('You need to be logged in');
      } finally {
        setLoading(false);
      }
    };
    fetchWatchList();
  }, []);

  const handleDelete = async (id) => {
    try {
      await removeWatchList(id, auth_token);
      // Remove deleted watchlist from state
      setWatchList((prev) => prev.filter((list) => list._id !== id));
    } catch (err) {
      alert('Failed to delete watchlist');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-10 md:px-20 py-10">
      <div className="max-w-7xl mx-auto mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-left">
          Your Watchlists
        </h1>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {watchList.length === 0 ? (
              <p className="text-center col-span-full text-gray-400">
                Nothing in your watchlist.
              </p>
            ) : (
              watchList.map((list) => (
                <div
                  key={list._id}
                  className="bg-[#1a2f53] text-black rounded-lg shadow-md p-5"
                >
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    {list.name}
                  </h2>
                  <ul className="text-sm text-white mb-4 list-disc pl-4">
                    {list.movies.map((movie) => (
                      <li key={movie.id || movie._id}>{movie.title}</li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/watchlist/${list._id}`)}
                      className="bg-amber-600 hover:bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(list._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
