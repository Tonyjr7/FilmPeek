import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function RecommendationExplanation({ movie }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!movie?.title && !movie?.name) return;

    const title = movie.title || movie.name;
    const genres = movie.genres?.map((g) => g.name) || [];
    const overview = movie.overview || '';

    setData(null);
    setError('');
    setLoading(true);

    api
      .post('/ai/explain', {
        movieTitle: title,
        genres,
        overview,
      })
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load AI insights'))
      .finally(() => setLoading(false));
  }, [movie?.id]);

  if (!movie) return null;

  const score = Math.min(
    100,
    Math.max(0, Number(data?.matchScore) || 0)
  );

  const circumference = 2 * Math.PI * 15.9155;
  const dashOffset =
    circumference - (score / 100) * circumference;

  return (
    <section
      id="recommendation-explanation"
      className="
        relative
        mt-8
        overflow-hidden
        rounded-2xl
        border
        border-zinc-700
        bg-zinc-950
        shadow-2xl
        shadow-black/30
      "
    >
      {/* Cinematic background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Red atmospheric glow */}
        <div
          className="
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-red-600/[0.08]
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-32
            h-80
            w-80
            rounded-full
            bg-red-900/[0.08]
            blur-[110px]
          "
        />

        {/* Subtle grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)]
            [background-size:45px_45px]
          "
        />

        {/* Cinematic light line */}
        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-red-500/40
            to-transparent
          "
        />

        {/* Ghosted FilmPeek symbol */}
        <div
          className="
            absolute
            -right-6
            top-1/2
            -translate-y-1/2
            select-none
            text-[190px]
            font-black
            leading-none
            text-white/[0.02]
          "
        >
          ✦
        </div>

        {/* Tiny cinematic particles */}
        <span className="absolute left-[12%] top-[22%] h-1 w-1 rounded-full bg-red-400/50" />
        <span className="absolute left-[35%] top-[15%] h-1 w-1 rounded-full bg-white/20" />
        <span className="absolute right-[25%] top-[28%] h-1.5 w-1.5 rounded-full bg-red-400/40" />
        <span className="absolute right-[12%] bottom-[22%] h-1 w-1 rounded-full bg-white/20" />
      </div>

      <div className="relative z-10 p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-red-500/20
                bg-red-500/10
                px-3
                py-1.5
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-red-500
                  shadow-[0_0_8px_rgba(239,68,68,.9)]
                "
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-red-400
                "
              >
                AI Insights
              </span>
            </div>

            <h4
              className="
                mt-3
                text-xl
                font-bold
                tracking-tight
                text-white
                sm:text-2xl
              "
            >
              Why you'll love this
            </h4>

            <p className="mt-1.5 text-sm text-zinc-400">
              FilmPeek analyzed this movie for you.
            </p>
          </div>

          {/* AI icon */}
          <div
            className="
              hidden
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-700
              bg-zinc-900
              text-lg
              text-red-500
              shadow-lg
              shadow-black/20
              sm:flex
            "
          >
            ✦
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-7">
            <div
              className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900/80
                p-5
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    h-20
                    w-20
                    shrink-0
                    animate-pulse
                    rounded-full
                    border-4
                    border-zinc-700
                  "
                />

                <div className="flex-1 space-y-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-zinc-700" />
                  <div className="h-4 w-44 animate-pulse rounded bg-zinc-800" />
                  <div className="h-3 w-32 animate-pulse rounded bg-zinc-700" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="h-3 w-full animate-pulse rounded bg-zinc-800" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-800" />
                <div className="h-3 w-4/6 animate-pulse rounded bg-zinc-800" />
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400">
                <span
                  className="
                    h-3.5
                    w-3.5
                    animate-spin
                    rounded-full
                    border-2
                    border-zinc-600
                    border-t-red-500
                  "
                />

                Analyzing this movie...
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div
            className="
              mt-7
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-red-500/20
              bg-red-500/[0.08]
              px-4
              py-4
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-red-500/10
                text-sm
                font-bold
                text-red-400
              "
            >
              !
            </span>

            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* AI Result */}
        {data && !loading && (
          <div className="mt-7">
            {/* Tagline */}
            {data.tagline && (
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-5
                  py-5
                  shadow-lg
                  shadow-black/20
                "
              >
                <div
                  className="
                    absolute
                    left-0
                    top-0
                    h-full
                    w-1
                    bg-red-500
                  "
                />

                <span
                  className="
                    absolute
                    -left-1
                    -top-5
                    text-7xl
                    font-serif
                    text-red-500/10
                  "
                >
                  "
                </span>

                <p
                  className="
                    relative
                    text-sm
                    font-medium
                    italic
                    leading-7
                    text-zinc-200
                    sm:text-base
                  "
                >
                  "{data.tagline}"
                </p>
              </div>
            )}

            {/* Match Score */}
            <div
              className="
                mt-5
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900
                p-5
                shadow-lg
                shadow-black/20
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  sm:flex-row
                  sm:items-center
                "
              >
                {/* Score ring */}
                <div className="relative h-28 w-28 shrink-0">
                  <svg
                    viewBox="0 0 36 36"
                    className="h-full w-full -rotate-90"
                  >
                    {/* Track */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-zinc-700"
                    />

                    {/* Progress */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className="
                        text-red-500
                        transition-all
                        duration-1000
                        ease-out
                      "
                    />
                  </svg>

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >
                    <span
                      className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-white
                      "
                    >
                      {score}%
                    </span>

                    <span
                      className="
                        mt-0.5
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-zinc-400
                      "
                    >
                      Match
                    </span>
                  </div>
                </div>

                {/* Match information */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {data.vibe && (
                      <span
                        className="
                          rounded-full
                          border
                          border-red-500/25
                          bg-red-500/10
                          px-3
                          py-1.5
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-red-400
                        "
                      >
                        {data.vibe}
                      </span>
                    )}

                    {score >= 90 && (
                      <span
                        className="
                          rounded-full
                          border
                          border-zinc-700
                          bg-zinc-800
                          px-3
                          py-1.5
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-zinc-300
                        "
                      >
                        Excellent match
                      </span>
                    )}

                    {score >= 80 && score < 90 && (
                      <span
                        className="
                          rounded-full
                          border
                          border-zinc-700
                          bg-zinc-800
                          px-3
                          py-1.5
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-zinc-300
                        "
                      >
                        Great match
                      </span>
                    )}

                    {score < 80 && score > 0 && (
                      <span
                        className="
                          rounded-full
                          border
                          border-zinc-700
                          bg-zinc-800
                          px-3
                          py-1.5
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-zinc-300
                        "
                      >
                        Good match
                      </span>
                    )}
                  </div>

                  {data.bestFor && (
                    <div className="mt-4">
                      <span
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.16em]
                          text-zinc-500
                        "
                      >
                        Best for
                      </span>

                      <p
                        className="
                          mt-1.5
                          text-sm
                          leading-6
                          text-zinc-300
                        "
                      >
                        {data.bestFor}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reasons */}
            {data.reasons?.length > 0 && (
              <div className="mt-7">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-zinc-800" />

                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-zinc-500
                    "
                  >
                    Why it matches
                  </span>

                  <span className="h-px flex-1 bg-zinc-800" />
                </div>

                <div className="space-y-3">
                  {data.reasons.map((reason, index) => (
                    <div
                      key={index}
                      className="
                        group
                        flex
                        items-start
                        gap-4
                        rounded-xl
                        border
                        border-zinc-800
                        bg-zinc-900/70
                        p-4
                        transition-all
                        duration-200
                        hover:border-zinc-700
                        hover:bg-zinc-800
                      "
                    >
                      {/* Number */}
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-red-500/20
                          bg-red-500/10
                          text-[10px]
                          font-bold
                          text-red-400
                        "
                      >
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      {/* Reason */}
                      <p
                        className="
                          flex-1
                          pt-1
                          text-sm
                          leading-6
                          text-zinc-300
                          transition-colors
                          group-hover:text-white
                        "
                      >
                        {reason}
                      </p>

                      {/* Arrow */}
                      <span
                        className="
                          hidden
                          pt-1
                          text-sm
                          text-zinc-600
                          transition
                          group-hover:translate-x-1
                          group-hover:text-red-400
                          sm:block
                        "
                      >
                        →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div
              className="
                mt-7
                flex
                items-center
                justify-between
                border-t
                border-zinc-800
                pt-5
              "
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500">
                  ✦
                </span>

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-zinc-500
                  "
                >
                  Powered by FilmPeek AI
                </p>
              </div>

              <span
                className="
                  hidden
                  text-[10px]
                  text-zinc-600
                  sm:block
                "
              >
                Personalized for you
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}