import { useParams } from 'react-router-dom';

const WatchMovie = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-6xl">😢</span>
        <p className="text-lg">You need to be logged in to watch this movie.</p>
      </div>
    );
  }

  const videoURL = `${process.env.REACT_APP_WATCH_URL}/movie/${id}?v=3.2.0&n=Filmpeek&o=https%3A%2F%2Ffilmpeek.vercel.app`;

  return (
    <div className="h-screen w-full bg-black">
      <iframe
        src={videoURL}
        allowFullScreen
        className="w-full h-full border-0"
        title="Watch Movie"
      ></iframe>
    </div>
  );
};

export default WatchMovie;
