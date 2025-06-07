import { useEffect, useState } from 'react';
import axios from 'axios';

export default function WatchListPage() {
  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const auth_token = localStorage.getItem('token');

  useEffect(() => {
    const fetchWatchList = async () => {
      try {
        const res = await axios.get(
          'http://192.168.0.129:5000/api/movie/user/watchlists',
          {
            headers: {
              Authorization: `Bearer ${auth_token}`,
            },
          },
        );

        const rawLists = res.data.watchlists;

        // Fetch details for each movie ID in every list
        const updatedLists = await Promise.all(
          rawLists.map(async (list) => {
            const movieDetails = await Promise.all(
              list.movies.map(async (id) => {
                const res = await axios.get(
                  `http://192.168.0.129:5000/api/movie/${id}`,
                );
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

  return (
    <div className="min-h-screen bg-black text-white px-20 py-10">
      <div className="max-w-5xl mt-20">
        <h1 className="text-4xl font-bold mb-8 text-left">Your Watchlists</h1>

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
                  <button className="bg-amber-600 hover:bg-yellow-500 text-white px-4 py-2 rounded">
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
