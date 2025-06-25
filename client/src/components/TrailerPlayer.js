// components/TrailerPlayer.js
const TrailerPlayer = ({ youtubeKey }) => {
  if (!youtubeKey) return null;

  const embedUrl = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=1&loop=1&controls=0&color=white&modestbranding=1&rel=0&playsinline=1&showinfo=0&enablejsapi=1`;

  return (
    <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
      <iframe
        className="w-full h-full"
        src={embedUrl}
        title="Movie Trailer"
        allow="autoplay"
        allowFullScreen
        frameBorder="0"
      />
    </div>
  );
};

export default TrailerPlayer;
