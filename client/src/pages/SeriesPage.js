import Hero from '../components/Hero';
import MovieCardRow from '../components/MovieCardRow';

const BASEURL = process.env.REACT_APP_BASE_URL;

function SeriesPage() {
  return (
    <>
      <Hero mediaType="tv" />
      <MovieCardRow
        title="Top 10 Popular TV Series"
        endpoint={`${BASEURL}/series/popular-series`}
        mediaType="tv"
      />
      <MovieCardRow
        title="Trending TV Series"
        endpoint={`${BASEURL}/series/trending`}
        mediaType="tv"
      />
      <MovieCardRow
        title="Top Rated TV Series"
        endpoint={`${BASEURL}/series/top-rated`}
        mediaType="tv"
      />
    </>
  );
}

export default SeriesPage;
