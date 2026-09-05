import { useParams, useLocation } from 'react-router-dom';

const WatchMovie = ({ isSeries = false }) => {
  const { id, type } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const season = queryParams.get('s') || '1';
  const episode = queryParams.get('e') || '1';

  const token = localStorage.getItem('token');
  const mediaType = isSeries || type === 'tv' ? 'tv' : 'movie';

  if (!token) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-6xl">😢</span>
        <p className="text-lg">
          You need to be logged in to watch this {mediaType === 'tv' ? 'series' : 'movie'}.
        </p>
      </div>
    );
  }

  const embedPath =
    mediaType === 'tv' ? `tv/${id}/${season}/${episode}` : `movie/${id}`;

  const videoURL = `${process.env.REACT_APP_WATCH_URL}/${embedPath}?v=3.2.0&n=Filmpeek&o=https%3A%2F%2Ffilmpeek.vercel.app`;

  return (
    <div className="h-screen w-full bg-black">
      <iframe
        src={videoURL}
        allowFullScreen
        className="w-full h-full border-0"
        title={mediaType === 'tv' ? `Watch TV Series S${season} E${episode}` : 'Watch Movie'}
      ></iframe>
    </div>
  );
};

export default WatchMovie;
