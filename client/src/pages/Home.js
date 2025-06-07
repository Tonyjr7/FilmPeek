import Hero from '../components/Hero';
import MovieCardRow from '../components/MovieCardRow';

function Home() {
  return (
    <>
      <Hero />
      <MovieCardRow
        title="Top 10 Popular Movies"
        endpoint="http://192.168.0.129:5000/api/movie/popular-movies"
      />
      <MovieCardRow
        title="Trending Movies"
        endpoint="http://192.168.0.129:5000/api/movie/trending"
      />
      <MovieCardRow
        title="Top Rated Movies"
        endpoint="http://192.168.0.129:5000/api/movie/top-rated"
      />
    </>
  );
}

export default Home;
