import { useState, useRef, useEffect } from 'react';
import api from '../utils/api';

const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const exampleQueries = [
  'Something like Interstellar but with more action',
  'A funny movie with heart',
  'Dark psychological thriller, no jump scares',
  'A movie that will keep me guessing',
];

const StarRating = ({ score }) => {
  const filled = Math.round((score / 100) * 5);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm transition ${
            star <= filled ? 'text-red-500' : 'text-zinc-800'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const FilmReel = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute rounded-full border-[24px] border-zinc-700/[0.08] ${className}`}
    >
      <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-700/[0.08]" />

      <div className="absolute left-[12%] top-[12%] h-7 w-7 rounded-full bg-zinc-700/[0.08]" />
      <div className="absolute right-[12%] top-[12%] h-7 w-7 rounded-full bg-zinc-700/[0.08]" />
      <div className="absolute bottom-[12%] left-[12%] h-7 w-7 rounded-full bg-zinc-700/[0.08]" />
      <div className="absolute bottom-[12%] right-[12%] h-7 w-7 rounded-full bg-zinc-700/[0.08]" />
    </div>
  );
};

const Particle = ({ className = '', red = false }) => {
  return (
    <span
      className={`pointer-events-none absolute rounded-full ${
        red ? 'bg-red-500/50' : 'bg-white/20'
      } ${className}`}
    />
  );
};

export default function AIMovieMatch({ onMovieSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (q) => {
    const searchQuery = (q || query).trim();

    if (!searchQuery) return;

    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);

    try {
      const res = await api.post('/ai/match', {
        query: searchQuery,
      });

      setResults(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'AI service is unavailable. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section
      id="ai-movie-match"
      className="
        relative isolate w-full overflow-hidden
        bg-black px-4 py-24
        sm:px-6
        lg:px-8
      "
    >
      {/* =========================================================
          CINEMATIC BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top cinematic glow */}
        <div
          className="
            absolute left-1/2 top-[-300px]
            h-[700px] w-[1100px]
            -translate-x-1/2
            rounded-full
            bg-red-700/[0.07]
            blur-[160px]
          "
        />

        {/* Left atmospheric glow */}
        <div
          className="
            absolute left-[-250px] top-[35%]
            h-[550px] w-[550px]
            rounded-full
            bg-red-950/[0.15]
            blur-[130px]
          "
        />

        {/* Right atmospheric glow */}
        <div
          className="
            absolute right-[-250px] bottom-[10%]
            h-[500px] w-[500px]
            rounded-full
            bg-red-950/[0.12]
            blur-[130px]
          "
        />

        {/* Ghosted FilmPeek text */}
        <div
          className="
            absolute left-1/2 top-20
            -translate-x-1/2
            select-none
            whitespace-nowrap
            text-[100px]
            font-black
            leading-none
            tracking-[-0.08em]
            text-white/[0.018]
            sm:text-[170px]
            lg:text-[250px]
          "
        >
          FILMPEEK
        </div>

        {/* Second ghost text */}
        <div
          className="
            absolute left-1/2 top-[52%]
            -translate-x-1/2
            select-none
            whitespace-nowrap
            text-[80px]
            font-black
            tracking-[-0.08em]
            text-white/[0.01]
            sm:text-[140px]
            lg:text-[220px]
          "
        >
          CINEMA
        </div>

        {/* Cinematic grid */}
        <div
          className="
            absolute inset-0 opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
            [background-size:80px_80px]
          "
        />

        {/* Film reels */}

        <FilmReel
          className="
            -left-32 top-16
            h-72 w-72
            sm:h-96 sm:w-96
          "
        />

        <FilmReel
          className="
            -right-40 bottom-[-100px]
            h-[420px] w-[420px]
            sm:h-[520px] sm:w-[520px]
          "
        />

        <FilmReel
          className="
            right-[12%] top-[18%]
            hidden h-28 w-28
            border-[12px]
            opacity-40
            lg:block
          "
        />

        {/* Particles */}
        <Particle
          red
          className="left-[10%] top-[28%] h-1 w-1"
        />

        <Particle
          className="left-[18%] top-[64%] h-1.5 w-1.5"
        />

        <Particle
          red
          className="left-[75%] top-[22%] h-1 w-1"
        />

        <Particle
          className="right-[14%] top-[43%] h-1.5 w-1.5"
        />

        <Particle
          red
          className="right-[23%] top-[72%] h-1 w-1"
        />

        <Particle
          className="left-[48%] top-[18%] h-1 w-1"
        />

        <Particle
          red
          className="left-[62%] top-[82%] h-1 w-1"
        />

        {/* Horizontal cinematic light */}
        <div
          className="
            absolute left-1/2 top-[47%]
            h-px w-[80%]
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-red-500/[0.08]
            to-transparent
          "
        />

        {/* Bottom vignette */}
        <div
          className="
            absolute inset-x-0 bottom-0
            h-72
            bg-gradient-to-t
            from-black
            to-transparent
          "
        />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =======================================================
            HEADER
        ======================================================== */}

        <div className="mx-auto max-w-4xl text-center">

          {/* AI badge */}
          <div
            className="
              mb-6 inline-flex items-center gap-2
              rounded-full
              border border-zinc-800
              bg-black/60
              px-4 py-2
              shadow-lg shadow-black/20
              backdrop-blur-md
            "
          >
            <span className="relative flex h-2 w-2">
              <span
                className="
                  absolute inline-flex h-full w-full
                  animate-ping rounded-full
                  bg-red-500 opacity-50
                "
              />

              <span
                className="
                  relative inline-flex h-2 w-2
                  rounded-full bg-red-500
                "
              />
            </span>

            <span
              className="
                text-[10px] font-bold
                uppercase tracking-[0.25em]
                text-zinc-400
              "
            >
              AI Movie Match
            </span>
          </div>

          {/* Heading */}
          <h2
            className="
              text-4xl font-black
              leading-[1.05]
              tracking-[-0.04em]
              text-white
              sm:text-5xl
              lg:text-7xl
            "
          >
            Your next movie
            <br />

            <span
              className="
                bg-gradient-to-r
                from-white
                via-zinc-300
                to-red-500
                bg-clip-text
                text-transparent
              "
            >
              is already waiting.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-6
              max-w-2xl
              text-sm
              leading-7
              text-zinc-500
              sm:text-base
            "
          >
            Tell FilmPeek what you're looking for.
            Describe a movie, a feeling, a story, or a
            specific vibe and let AI find the films that
            fit.
          </p>
        </div>

        {/* =======================================================
            SEARCH AREA
        ======================================================== */}

        <div className="mx-auto mt-12 max-w-4xl">

          <div
            className="
              relative
              rounded-2xl
              border border-zinc-800
              bg-zinc-950/90
              p-2
              shadow-2xl
              shadow-black/50
              backdrop-blur-xl
              transition
              focus-within:border-zinc-700
              focus-within:shadow-red-950/10
            "
          >

            {/* Search glow */}
            <div
              className="
                pointer-events-none
                absolute inset-0
                rounded-2xl
                bg-red-500/[0.02]
              "
            />

            <div
              className="
                relative
                flex flex-col
                gap-2
                sm:flex-row
                sm:items-center
              "
            >

              {/* Search icon */}
              <div className="hidden pl-4 text-zinc-600 sm:block">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                id="ai-match-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Describe the movie you're looking for..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-4 py-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-zinc-600
                  sm:px-2
                "
              />

              {/* Search button */}
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                id="ai-match-search-btn"
                className="
                  flex h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-7
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-red-950/20
                  transition-all
                  hover:bg-red-500
                  hover:shadow-red-900/30
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:bg-zinc-800
                  disabled:text-zinc-600
                  disabled:shadow-none
                "
              >
                {loading ? (
                  <>
                    <span
                      className="
                        h-4 w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />
                    Searching
                  </>
                ) : (
                  <>
                    Find movies
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* =====================================================
              EXAMPLES
          ====================================================== */}

          {!searched && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">

              <span
                className="
                  mr-1
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-zinc-700
                "
              >
                Try
              </span>

              {exampleQueries.map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setQuery(example);
                    handleSearch(example);
                  }}
                  className="
                    rounded-full
                    border border-zinc-800
                    bg-zinc-950/70
                    px-3.5 py-2
                    text-xs
                    text-zinc-500
                    backdrop-blur
                    transition
                    hover:border-zinc-700
                    hover:bg-zinc-900
                    hover:text-zinc-300
                  "
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =======================================================
            ERROR
        ======================================================== */}

        {error && (
          <div
            className="
              mx-auto mt-8
              flex max-w-2xl
              items-center justify-center
              gap-3
              rounded-xl
              border border-red-900/40
              bg-red-950/20
              px-5 py-4
              text-sm
              text-red-400
            "
          >
            <span
              className="
                flex h-6 w-6
                items-center justify-center
                rounded-full
                bg-red-500/10
                text-xs
                font-bold
              "
            >
              !
            </span>

            {error}
          </div>
        )}

        {/* =======================================================
            LOADING
        ======================================================== */}

        {loading && (
          <div className="mt-16">

            <div className="mb-7">
              <div className="h-3 w-36 animate-pulse rounded bg-zinc-900" />
              <div className="mt-3 h-6 w-52 animate-pulse rounded bg-zinc-900" />
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-4
                sm:grid-cols-3
                lg:grid-cols-4
              "
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="
                    overflow-hidden
                    rounded-xl
                    border border-zinc-900
                    bg-zinc-950
                  "
                >
                  <div
                    className="
                      aspect-[2/3]
                      animate-pulse
                      bg-zinc-900
                    "
                  />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-900" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-900" />
                    <div className="h-10 animate-pulse rounded bg-zinc-900" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =======================================================
            RESULTS
        ======================================================== */}

        {!loading && results.length > 0 && (
          <div className="mt-16">

            {/* Results header */}
            <div
              className="
                mb-7
                flex flex-col
                gap-3
                border-b border-zinc-900
                pb-6
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >

              <div>
                <div
                  className="
                    flex items-center gap-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-red-500
                  "
                >
                  <span>✦</span>
                  AI Recommendations
                </div>

                <h3
                  className="
                    mt-2
                    text-2xl
                    font-bold
                    tracking-tight
                    text-white
                  "
                >
                  Movies picked for you
                </h3>

                <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                  Based on your description:
                  <span className="ml-1 text-zinc-400">
                    "{query}"
                  </span>
                </p>
              </div>

              <div
                className="
                  self-start
                  rounded-full
                  border border-zinc-800
                  bg-zinc-950
                  px-3 py-1.5
                  text-xs
                  text-zinc-600
                  sm:self-auto
                "
              >
                {results.length} matches
              </div>
            </div>

            {/* =================================================
                MOVIE GRID
            ================================================== */}

            <div
              className="
                grid
                grid-cols-2
                gap-4
                sm:grid-cols-3
                lg:grid-cols-4
              "
            >
              {results.map((movie, idx) => {
                const d = movie.tmdbData;

                const genres = (d.genre_ids || [])
                  .slice(0, 2)
                  .map((id) => GENRE_MAP[id])
                  .filter(Boolean);

                return (
                  <article
                    key={d.id}
                    onClick={() =>
                      onMovieSelect &&
                      onMovieSelect(d)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        onMovieSelect
                      ) {
                        onMovieSelect(d);
                      }
                    }}
                    className="
                      group
                      relative
                      cursor-pointer
                      overflow-hidden
                      rounded-xl
                      border border-zinc-900
                      bg-zinc-950
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-zinc-700
                      hover:shadow-2xl
                      hover:shadow-black
                    "
                  >

                    {/* Rank */}
                    <div
                      className="
                        absolute left-3 top-3
                        z-20
                        flex h-7
                        min-w-7
                        items-center
                        justify-center
                        rounded-md
                        border border-white/10
                        bg-black/80
                        px-2
                        text-[10px]
                        font-bold
                        text-white
                        backdrop-blur-md
                      "
                    >
                      #{idx + 1}
                    </div>

                    {/* Match score */}
                    <div
                      className="
                        absolute right-3 top-3
                        z-20
                        rounded-md
                        border
                        border-red-400/20
                        bg-red-600/90
                        px-2.5 py-1.5
                        text-[10px]
                        font-black
                        tracking-wide
                        text-white
                        shadow-lg
                        shadow-black/40
                        backdrop-blur
                      "
                    >
                      {movie.matchScore}%
                    </div>

                    {/* Poster */}
                    <div
                      className="
                        relative
                        aspect-[2/3]
                        overflow-hidden
                        bg-zinc-900
                      "
                    >
                      {d.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${d.poster_path}`}
                          alt={d.title}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-all
                            duration-700
                            group-hover:scale-110
                            group-hover:brightness-75
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            items-center
                            justify-center
                            bg-zinc-950
                            text-5xl
                            text-zinc-800
                          "
                        >
                          🎬
                        </div>
                      )}

                      {/* Poster dark gradient */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black
                          via-transparent
                          to-black/20
                        "
                      />

                      {/* Red hover atmosphere */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-red-600/0
                          transition-all
                          duration-500
                          group-hover:bg-red-600/[0.08]
                        "
                      />

                      {/* Play button */}
                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <div
                          className="
                            flex
                            h-12 w-12
                            scale-75
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-sm
                            text-black
                            opacity-0
                            shadow-2xl
                            transition-all
                            duration-300
                            group-hover:scale-100
                            group-hover:opacity-100
                          "
                        >
                          ▶
                        </div>
                      </div>

                      {/* Match label */}
                      <div
                        className="
                          absolute
                          bottom-3
                          left-3
                          rounded-md
                          border
                          border-white/10
                          bg-black/75
                          px-2.5 py-1
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-red-400
                          backdrop-blur-md
                        "
                      >
                        AI Match
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4">

                      {/* Title */}
                      <h3
                        className="
                          truncate
                          text-sm
                          font-bold
                          text-white
                        "
                        title={d.title}
                      >
                        {d.title}
                      </h3>

                      {/* Meta */}
                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          gap-2
                          text-[11px]
                          text-zinc-600
                        "
                      >
                        {d.release_date && (
                          <span>
                            {d.release_date.slice(0, 4)}
                          </span>
                        )}

                        {d.release_date &&
                          d.vote_average > 0 && (
                            <span className="text-zinc-800">
                              •
                            </span>
                          )}

                        {d.vote_average > 0 && (
                          <span>
                            ⭐ {d.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {/* Genres */}
                      {genres.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {genres.map((genre) => (
                            <span
                              key={genre}
                              className="
                                rounded-md
                                bg-zinc-900
                                px-2 py-1
                                text-[9px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-zinc-500
                              "
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* AI reason */}
                      <p
                        className="
                          mt-4
                          line-clamp-3
                          min-h-[60px]
                          text-xs
                          leading-5
                          text-zinc-500
                        "
                      >
                        {movie.reason}
                      </p>

                      {/* Footer */}
                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          border-t
                          border-zinc-900
                          pt-3
                        "
                      >
                        <StarRating
                          score={movie.matchScore}
                        />

                        <span
                          className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-zinc-700
                          "
                        >
                          {movie.matchScore >= 90
                            ? 'Excellent'
                            : movie.matchScore >= 80
                            ? 'Great'
                            : 'Good'}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* =======================================================
            EMPTY STATE
        ======================================================== */}

        {!loading &&
          searched &&
          results.length === 0 &&
          !error && (
            <div
              className="
                relative
                mx-auto
                mt-20
                max-w-lg
                overflow-hidden
                rounded-2xl
                border
                border-zinc-900
                bg-zinc-950/70
                px-6 py-12
                text-center
              "
            >
              {/* Empty state glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-0
                  h-32
                  w-32
                  -translate-x-1/2
                  rounded-full
                  bg-red-600/10
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-zinc-800
                  bg-black
                  text-2xl
                "
              >
                🎬
              </div>

              <h3
                className="
                  relative
                  mt-6
                  text-lg
                  font-bold
                  text-white
                "
              >
                Nothing matched that vibe
              </h3>

              <p
                className="
                  relative
                  mx-auto
                  mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-zinc-600
                "
              >
                Try describing your movie differently.
                You can mention a genre, actor, mood,
                story, or another movie you enjoyed.
              </p>
            </div>
          )}

      </div>
    </section>
  );
}