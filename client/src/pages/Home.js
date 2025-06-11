import Hero from '../components/Hero';
import MovieCardRow from '../components/MovieCardRow';

const BASEURL = process.env.REACT_APP_BASE_URL;

function Home() {
  return (
    <>
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
