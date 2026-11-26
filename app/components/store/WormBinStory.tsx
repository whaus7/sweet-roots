"use client";

import { useEffect, useState } from "react";

const STAGES = [
  {
    id: "scraps",
    label: "Scraps",
    kicker: "Day one",
    title: "Kitchen scraps go in the top",
    body: "Peels, leaves, and a little bedding. The worms are already at the edges, pulling the soft pieces under.",
  },
  {
    id: "working",
    label: "Working",
    kicker: "The work",
    title: "They eat the pile from the inside",
    body: "A red wiggler often takes in about half its weight in scraps a day. What leaves the other end is a cast — ground up, mixed, and seeded with the bacteria from its gut.",
  },
  {
    id: "gold",
    label: "Black gold",
    kicker: "The finish",
    title: "Scraps, rewritten",
    body: "The pile is dark, crumbly, and smells like a forest floor. That handful is what goes back into the bed.",
  },
  {
    id: "harvest",
    label: "Harvest",
    kicker: "The take",
    title: "It leaves through the bottom",
    body: "Finished castings drop through the holes. The worms stay up with the food, and the bin keeps working while the black gold comes out.",
  },
] as const;

const BENEFITS = [
  {
    id: "plants",
    title: "Plants",
    body: "Castings feed without the jolt of a salt fertilizer. Plants get a slow supply of nutrients, plus the growth signals researchers keep finding in vermicompost.",
  },
  {
    id: "roots",
    title: "Roots",
    body: "Worm tunnels are already-dug hallways. Roots follow the air and the moisture instead of stalling in packed ground.",
  },
  {
    id: "microbiome",
    title: "Microbiome",
    body: "A worm gut is a small brewery. Casts come out denser with living bacteria than the soil that went in.",
  },
  {
    id: "water",
    title: "Water",
    body: "The crumbs hold rain the way a sponge does, and the tunnels let the extra drain. Roots can drink without sitting in a puddle.",
  },
  {
    id: "disease",
    title: "Disease",
    body: "The microbes in a casting take up space some root diseases need, so those diseases have a harder time taking hold. It is a living effect in the soil, not a spray.",
  },
  {
    id: "fungi",
    title: "Fungi",
    body: "Worms shred scraps into pieces fungi can actually colonize. In a bed you don't till, mycorrhizae stay threaded through the tunnels the worms keep open.",
  },
] as const;

const WORMS = [
  { scraps: ["18%", "22%", -14], working: ["28%", "46%", 16], gold: ["20%", "64%", -8], harvest: ["12%", "1%", -12] },
  { scraps: ["58%", "30%", 10], working: ["62%", "58%", -18], gold: ["48%", "72%", 12], harvest: ["42%", "0%", 8] },
  { scraps: ["34%", "48%", -6], working: ["18%", "70%", 8], gold: ["70%", "58%", -16], harvest: ["64%", "3%", -6] },
  { scraps: ["72%", "18%", 20], working: ["44%", "36%", -10], gold: ["30%", "80%", 6], harvest: ["78%", "1%", 14] },
  { scraps: ["46%", "64%", 4], working: ["74%", "78%", 14], gold: ["58%", "48%", -4], harvest: ["28%", "4%", 6] },
] as const;

const HOLES = [16, 38, 62, 84] as const;

const CRUMBS = [
  [6, 18, 11, 0],
  [14, 42, 16, 1],
  [22, 70, 8, 2],
  [28, 28, 13, 1],
  [36, 56, 18, 0],
  [44, 22, 7, 2],
  [48, 78, 14, 1],
  [56, 40, 12, 0],
  [62, 64, 20, 2],
  [70, 18, 9, 1],
  [74, 48, 15, 0],
  [82, 30, 12, 2],
  [88, 72, 8, 1],
  [12, 84, 13, 0],
  [33, 88, 9, 2],
  [66, 86, 11, 1],
  [90, 52, 7, 0],
  [8, 58, 6, 2],
] as const;

function goldHeight(stage: number) {
  return ["12%", "42%", "82%", "42%"][stage];
}

function scrapHeight(stage: number) {
  return ["84%", "34%", "0%", "30%"][stage];
}

function bedHeight(stage: number) {
  return ["22%", "74%", "94%", "74%"][stage];
}

export function WormBinStory() {
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      setStage((current) => (current + 1) % STAGES.length);
    }, 4600);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  const scene = STAGES[stage];

  function chooseStage(next: number) {
    setStage(next);
    setPaused(true);
  }

  return (
    <section
      aria-labelledby="worm-bin-story"
      className="border-t border-[#d9d0c0] bg-[#ebe4d4] px-5 py-16 text-[#1c1812] sm:px-8 sm:py-24"
    >
      <style>{`
        @keyframes worm-wiggle {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-3px) rotate(5deg); }
        }
        @keyframes sprout-rise {
          from { transform: scaleY(0.2); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        @keyframes casting-fall {
          0% { transform: translateY(-8px) scale(0.75); opacity: 0; }
          16% { opacity: 1; }
          100% { transform: translateY(62px) scale(1); opacity: 0.15; }
        }
        .worm-wiggle { animation: worm-wiggle 1.6s ease-in-out infinite; transform-origin: center; }
        .sprout-rise { animation: sprout-rise 900ms ease-out both; transform-origin: bottom center; }
        .casting-fall { animation: casting-fall 1.45s ease-in infinite; }
        @media (prefers-reduced-motion: reduce) {
          .worm-wiggle, .sprout-rise, .casting-fall { animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#5c5348]">
            In the soil
          </p>
          <h2
            id="worm-bin-story"
            className="catalog-display mt-3 text-4xl leading-tight sm:text-5xl"
          >
            From scraps to black gold
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#3c342c]">
            A thriving worm population does more than empty the scrap bowl. It
            rebuilds the soil the plants are standing in.
          </p>
        </header>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#5c5348]">
              Continous Flow Through (CFT) Worm Bin
            </p>
            <div className="relative mt-4">
              <div className="relative z-10 mx-4 h-4 rounded-t-md bg-[#6b4a30] shadow-[0_8px_16px_rgba(40,24,12,0.16)]" />
              <div
                className="relative -mt-px rounded-b-2xl p-3 pt-2 shadow-[0_18px_40px_rgba(40,24,12,0.16)]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #6d4a30 0 18px, #7d5840 18px 20px, #624228 20px 34px)",
                }}
              >
                <div className="flex h-[30rem] flex-col sm:h-[34rem]">
                  <div className="relative min-h-0 flex-1 overflow-hidden bg-[#f0e2cc]">
                    <div
                      className="absolute inset-x-0 bottom-0 bg-[#6a4c34] transition-[height] duration-[1600ms] ease-in-out"
                      style={{ height: bedHeight(stage) }}
                    />

                    <div
                      className="absolute inset-x-0 bottom-0 transition-[height] duration-[1600ms] ease-in-out"
                      style={{ height: goldHeight(stage) }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-[#3a2a1c] via-[#1a120e] to-[#0c0a08]" />
                      <Crumbs />
                      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#8d6a45]/80 to-transparent" />
                    </div>

                    <div
                      className="absolute inset-x-0 top-0 overflow-hidden transition-all duration-[1600ms] ease-in-out [mask-image:linear-gradient(to_bottom,#000_86%,transparent)]"
                      style={{
                        height: scrapHeight(stage),
                        opacity: stage === 2 ? 0 : 1,
                      }}
                    >
                      <Scraps faded={stage === 1} />
                    </div>

                    {WORMS.map((worm, index) => {
                      const spot =
                        stage === 0
                          ? worm.scraps
                          : stage === 1
                            ? worm.working
                            : stage === 2
                              ? worm.gold
                              : worm.harvest;
                      return (
                        <div
                          key={index}
                          className="absolute z-10 transition-all duration-[1600ms] ease-in-out"
                          style={{
                            left: spot[0],
                            top: spot[1],
                            transform: `rotate(${spot[2]}deg)`,
                          }}
                        >
                          <span
                            className="block"
                            style={{ transform: index % 2 === 1 ? "scaleX(-1)" : undefined }}
                          >
                            <WormGraphic delay={index * 0.18} />
                          </span>
                        </div>
                      );
                    })}

                    {stage === 2 ? (
                      <div
                        className="sprout-rise absolute left-[43%] z-20 w-10"
                        style={{ bottom: "76%" }}
                      >
                        <img
                          src="/images/worms/bin-art/bin-sprout.png?v=2"
                          alt=""
                          className="h-auto w-full"
                        />
                      </div>
                    ) : null}
                  </div>

                  <BinFloor open={stage === 3} />

                  <div
                    className="relative h-16 overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(to bottom, #6a5340 0%, #b7a48c 34%, #e3d5c2 100%)",
                    }}
                  >
                    <HarvestSpill show={stage === 3} reduced={reduced} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-1.5">
              {STAGES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseStage(index)}
                  aria-pressed={stage === index}
                  className={`h-11 rounded-full border px-1 text-[11px] leading-tight transition-colors sm:text-sm ${
                    stage === index
                      ? "border-[#1c1812] bg-[#1c1812] text-[#f4efe4]"
                      : "border-[#1c1812]/25 bg-transparent text-[#1c1812] hover:border-[#1c1812]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {reduced ? null : (
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                className="mt-3 text-sm text-[#5c5348] underline-offset-4 hover:underline"
              >
                {paused ? "Play the bin" : "Pause"}
              </button>
            )}
          </div>

          <div>
            <div className="min-h-[16.5rem] sm:min-h-[14.5rem]">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#5c5348]">
                {scene.kicker}
              </p>
              <h3 className="catalog-display mt-2 text-3xl leading-tight sm:text-4xl">
                {scene.title}
              </h3>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#3c342c]">
                {scene.body}
              </p>
            </div>

            <h3 className="catalog-display text-2xl">What a busy worm bed does</h3>
            <ul className="mt-6 max-w-xl space-y-6">
              {BENEFITS.map((benefit) => (
                <li key={benefit.id}>
                  <h4 className="catalog-display text-xl">{benefit.title}</h4>
                  <p className="mt-1 text-base leading-relaxed text-[#3c342c]">
                    {benefit.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function WormGraphic({ delay }: { delay: number }) {
  return (
    <img
      src="/images/worms/bin-art/bin-worm.png"
      alt=""
      className="worm-wiggle h-16 w-16 max-w-none object-contain"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

function Scraps({ faded }: { faded: boolean }) {
  return (
    <div
      className="relative h-full transition-opacity duration-700"
      style={{ opacity: faded ? 0.55 : 1 }}
      aria-hidden
    >
      <img
        src="/images/worms/bin-art/bin-scrap-pile.png"
        alt=""
        className="pointer-events-none absolute left-1/2 top-0 w-[108%] max-w-none -translate-x-1/2 select-none"
      />
    </div>
  );
}


function Crumbs() {
  const fills = ["#c6a36a", "#4a3424", "#24180f"];
  return (
    <div className="absolute inset-0" aria-hidden>
      {CRUMBS.map(([left, top, size, tone]) => (
        <svg
          key={`${left}-${top}`}
          viewBox="0 0 20 16"
          className="absolute"
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size * 0.75 }}
          aria-hidden
        >
          <path
            d={
              tone === 1
                ? "M2 9 C 3 3, 9 2, 14 6 C 19 10, 16 15, 9 14 C 4 13, 1 11, 2 9"
                : "M4 8 C 6 2, 12 3, 16 7 C 18 12, 12 15, 7 13 C 3 12, 2 10, 4 8"
            }
            fill={fills[tone]}
            opacity="0.85"
          />
        </svg>
      ))}
    </div>
  );
}

function BinFloor({ open }: { open: boolean }) {
  return (
    <div className="relative h-7" aria-hidden>
      {HOLES.map((left) => (
        <span
          key={left}
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700"
          style={{
            left: `${left}%`,
            background: open
              ? "radial-gradient(circle at 50% 42%, #5a4030 0 18%, #140e0b 58%, #1c140f 100%)"
              : "radial-gradient(circle at 50% 40%, #8d6848 0 30%, #5c3e2a 72%, #4a321f 100%)",
            boxShadow: open
              ? "inset 0 3px 5px rgba(0,0,0,0.65), 0 0 0 2px rgba(74,48,28,0.45)"
              : "inset 0 1px 2px rgba(0,0,0,0.35)",
          }}
        />
      ))}
    </div>
  );
}

function HarvestSpill({ show, reduced }: { show: boolean; reduced: boolean }) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-700"
      style={{ opacity: show ? 1 : 0 }}
      aria-hidden
    >
      {HOLES.map((left, hole) =>
        [0, 0.5, 1].map((delay, index) => (
          <span
            key={`${left}-${delay}`}
            className={reduced ? "absolute top-0" : "casting-fall absolute top-0"}
            style={
              reduced
                ? {
                    left: `calc(${left}% - 8px)`,
                    transform: `translateY(${12 + index * 16}px)`,
                    opacity: 0.85,
                  }
                : {
                    left: `calc(${left}% - 8px)`,
                    animationDelay: `${delay + hole * 0.2}s`,
                  }
            }
          >
            <CastingDrop variant={(hole + index) % 2} />
          </span>
        )),
      )}
      <div className="absolute inset-x-3 bottom-1 h-12">
        <CastingPile />
      </div>
    </div>
  );
}

function CastingDrop({ variant }: { variant: number }) {
  return (
    <svg viewBox="0 0 22 16" className="h-4 w-5" aria-hidden>
      <path
        d={
          variant === 0
            ? "M4 8 C 5 3, 11 2, 15 6 C 19 9, 16 14, 10 14 C 5 13, 3 11, 4 8"
            : "M3 9 C 4 4, 9 2, 14 5 C 18 8, 17 13, 11 14 C 6 14, 2 12, 3 9"
        }
        fill="#1a120e"
      />
      <path d="M7 7 C 9 5, 12 6, 12 8" fill="#6b5038" opacity="0.55" />
    </svg>
  );
}

function CastingPile() {
  return (
    <svg viewBox="0 0 300 64" className="h-full w-full" aria-hidden>
      <path
        d="M16 54 C 36 28, 70 24, 96 46 C 118 18, 160 16, 184 44 C 214 14, 262 28, 286 52 C 210 66, 90 68, 16 54"
        fill="#1a120e"
      />
      <path d="M40 50 C 58 36, 84 38, 98 50" fill="#3a2a1c" opacity="0.85" />
      <path d="M150 48 C 168 32, 198 34, 214 50" fill="#4a3828" opacity="0.7" />
      <path d="M70 46 C 74 40, 84 40, 88 47" fill="#c6a36a" opacity="0.45" />
      <path d="M176 44 C 182 38, 194 39, 196 46" fill="#6b5038" opacity="0.8" />
      <path d="M230 48 C 236 42, 248 44, 246 52" fill="#c6a36a" opacity="0.35" />
    </svg>
  );
}
