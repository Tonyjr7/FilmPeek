import { Link } from 'react-router-dom';
import { TvIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export default function SeriesCTA() {
  return (
    <div className="w-full my-12 px-4 md:px-20">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/70 via-zinc-900 to-amber-900/40 border border-amber-500/30 p-8 md:p-14 shadow-2xl backdrop-blur-xl group hover:border-amber-500/60 transition-all duration-500">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-all duration-500 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-600/20 rounded-full blur-3xl group-hover:bg-amber-600/30 transition-all duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <SparklesIcon className="w-4 h-4 text-amber-400" />
              <span>NEW FEATURE • TV SERIES ON FILMPEEK</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md">
              Binge Your Favorite <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500">TV Series</span> & Seasons
            </h2>

            <p className="text-gray-300 text-sm sm:text-lg font-light leading-relaxed">
              Explore complete season listings, episode guides, and high-definition streams for the hottest TV shows, trending series, and all-time classics.
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 items-center">
            <Link
              to="/series"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-lg hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-amber-500/25 group/btn"
            >
              <TvIcon className="w-6 h-6 text-black" />
              <span>Explore TV Series</span>
              <ArrowRightIcon className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
