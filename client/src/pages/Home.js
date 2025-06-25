import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MovieCardRow from '../components/MovieCardRow';
import axios from 'axios';

const BASEURL = process.env.REACT_APP_BASE_URL;

function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    let didRespond = false;

    const wakeServer = async () => {
      try {
        await axios.get('https://filmpeek-production.up.railway.app');
        didRespond = true;
        setShowSplash(false);
      } catch (err) {
        console.error('Backend still sleeping...');
      }
    };

    wakeServer();

    const timeout = setTimeout(() => {
      if (!didRespond) {
        setShowSplash(false); // don't wait forever
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <img src="/filmpeek.png" alt="FilmPeek" className="w-40 h-auto" />
        </div>
      )}

      <Hero />
      <MovieCardRow
        title="Top 10 Popular Movies"
        endpoint={`${BASEURL}/movie/popular-movies`}
      />
      <MovieCardRow
        title="Recommended For You"
        endpoint={`${BASEURL}/movie/user/recommendations`}
      />
      <MovieCardRow
        title="Trending Movies"
        endpoint={`${BASEURL}/movie/trending`}
      />
      <MovieCardRow
        title="Top Rated Movies"
        endpoint={`${BASEURL}/movie/top-rated`}
      />
    </>
  );
}

export default Home;
