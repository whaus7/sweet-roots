"use client";

import { useEffect, useState } from "react";

const STAGES = [
  {
    id: "scraps",
    label: "Scraps",
    kicker: "Day one",
    title: "The bin is still dinner",
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
  { scraps: ["18%", "22%", -14], working: ["28%", "46%", 16], gold: ["20%", "64%", -8] },
  { scraps: ["58%", "30%", 10], working: ["62%", "58%", -18], gold: ["48%", "72%", 12] },
  { scraps: ["34%", "48%", -6], working: ["18%", "70%", 8], gold: ["70%", "58%", -16] },
  { scraps: ["72%", "18%", 20], working: ["44%", "36%", -10], gold: ["30%", "80%", 6] },
  { scraps: ["46%", "64%", 4], working: ["74%", "78%", 14], gold: ["58%", "48%", -4] },
] as const;

function goldHeight(stage: number) {
  return stage === 0 ? "10%" : stage === 1 ? "42%" : "80%";
}

function scrapHeight(stage: number) {
  return stage === 0 ? "70%" : stage === 1 ? "28%" : "0%";
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
        .worm-wiggle { animation: worm-wiggle 1.6s ease-in-out infinite; transform-origin: center; }
        .sprout-rise { animation: sprout-rise 900ms ease-out both; transform-origin: bottom center; }
        @media (prefers-reduced-motion: reduce) {
          .worm-wiggle, .sprout-rise { animation: none; }
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
              Side slice of a bin
            </p>
            <div className="relative mt-4">
              <div className="relative z-10 mx-4 h-4 rounded-t-md bg-[#5a3b24] shadow-[0_8px_16px_rgba(40,24,12,0.18)]" />
              <div
                className="relative -mt-px overflow-hidden rounded-b-2xl p-3 pt-2 shadow-[0_18px_40px_rgba(40,24,12,0.18)]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #6b4428 0 18px, #7a5232 18px 20px, #623e24 20px 34px)",
                }}
              >
                <div className="relative h-[26rem] overflow-hidden rounded-b-lg bg-[#d9c4a2] sm:h-[30rem]">
                  <div
                    className="absolute inset-x-0 bottom-0 bg-[#6b4a32] transition-[height] duration-[1600ms] ease-in-out"
                    style={{
                      height: stage === 0 ? "18%" : stage === 1 ? "74%" : "92%",
                    }}
                  />

                  <div
                    className="absolute inset-x-0 bottom-0 transition-[height] duration-[1600ms] ease-in-out"
                    style={{ height: goldHeight(stage) }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#24180f] to-[#100c09]" />
                    <Crumbs />
                    <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#8d6a45] to-transparent" />
                  </div>

                  <MixBits show={stage === 1} />

                  <div
                    className="absolute inset-x-0 top-0 overflow-hidden transition-all duration-[1600ms] ease-in-out"
                    style={{ height: scrapHeight(stage), opacity: stage === 2 ? 0 : 1 }}
                  >
                    <Scraps faded={stage === 1} />
                  </div>

                  {WORMS.map((worm, index) => {
                    const spot =
                      stage === 0 ? worm.scraps : stage === 1 ? worm.working : worm.gold;
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
                      className="sprout-rise absolute left-[46%] z-20 w-8"
                      style={{ bottom: "78%" }}
                    >
                      <Sprout />
                    </div>
                  ) : null}

                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {STAGES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseStage(index)}
                  aria-pressed={stage === index}
                  className={`h-11 flex-1 rounded-full border text-sm transition-colors ${
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

            <h3 className="catalog-display text-2xl">
              What a busy worm bed does
            </h3>
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
    <svg
      viewBox="0 0 88 22"
      className="worm-wiggle h-4 w-16"
      style={{ animationDelay: `${delay}s` }}
      aria-hidden
    >
      <path
        d="M4 12 C 16 3, 26 21, 40 12 S 64 3, 84 12"
        stroke="#7a2e28"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 12 C 16 3, 26 21, 40 12 S 64 3, 84 12"
        stroke="#d06a56"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="4 6"
        fill="none"
      />
      <circle cx="83" cy="12" r="1.2" fill="#2a1210" />
    </svg>
  );
}

function Sprout() {
  return (
    <svg viewBox="0 0 40 56" className="h-14 w-8" aria-hidden>
      <path d="M20 54 V 24" stroke="#2f6b32" strokeWidth="2.4" fill="none" />
      <path d="M20 30 C 8 26, 6 12, 16 10 C 14 22, 18 28, 20 30" fill="#2f6b32" />
      <path d="M20 26 C 32 20, 34 8, 24 8 C 26 18, 22 24, 20 26" fill="#3d8a40" />
    </svg>
  );
}

const CRUMBS = [
  [6, 18, 10],
  [14, 42, 16],
  [22, 70, 8],
  [28, 28, 12],
  [36, 56, 18],
  [44, 22, 7],
  [48, 78, 14],
  [56, 40, 11],
  [62, 64, 20],
  [70, 18, 9],
  [74, 48, 15],
  [82, 30, 12],
  [88, 72, 8],
  [12, 84, 13],
  [33, 88, 9],
  [66, 86, 11],
  [90, 52, 7],
  [8, 58, 6],
] as const;

function Crumbs() {
  return (
    <div className="absolute inset-0" aria-hidden>
      {CRUMBS.map(([left, top, size], index) => (
        <span
          key={`${left}-${top}`}
          className="absolute rounded-full"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: Math.round(size * 0.72),
            background: index % 3 === 0 ? "#c6a36a" : index % 3 === 1 ? "#4a3424" : "#2a1c12",
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}

function MixBits({ show }: { show: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[34%] h-24 transition-opacity duration-700"
      style={{ opacity: show ? 1 : 0 }}
      aria-hidden
    >
      <span className="absolute left-[18%] top-2 h-2 w-7 -rotate-6 rounded-full bg-[#8d6a45]" />
      <span className="absolute left-[46%] top-8 h-2.5 w-4 rotate-12 rounded-sm bg-[#6a8a48]/80" />
      <span className="absolute right-[22%] top-4 h-2 w-8 rotate-3 rounded-full bg-[#a36840]/80" />
      <span className="absolute right-[40%] top-12 h-1.5 w-5 -rotate-12 rounded-full bg-[#c4b08a]" />
    </div>
  );
}

function Scraps({ faded }: { faded: boolean }) {
  return (
    <div
      className="relative h-full transition-opacity duration-700"
      style={{ opacity: faded ? 0.55 : 1 }}
      aria-hidden
    >
      <div className="absolute left-[10%] top-[16%] h-11 w-11 rounded-full bg-[#a33b32]">
        <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 -translate-y-2 bg-[#5d6b38]" />
      </div>
      <div className="absolute left-[34%] top-[8%] h-8 w-[4.5rem] -rotate-12 rounded-full bg-[#6f8f45]" />
      <div className="absolute right-[16%] top-[20%] h-7 w-12 rotate-6 rounded-t-full border-2 border-[#f3efe6] bg-[#f7f3ea]" />
      <div className="absolute left-[18%] top-[42%] h-5 w-16 rotate-[-8deg] rounded-full border-[5px] border-[#d4a24a] border-b-transparent" />
      <div className="absolute right-[28%] top-[40%] h-9 w-6 rounded-sm bg-[#c45c2a]" />
      <div className="absolute left-[48%] top-[28%] h-6 w-14 rotate-3 rounded-full bg-[#3f6b34]" />
      <div className="absolute left-[62%] top-[14%] h-8 w-8 rotate-12 rounded-full bg-[#7a9a52]" />
      <div className="absolute left-[26%] top-[34%] h-4 w-10 -rotate-6 rounded-full bg-[#d7b15a]" />
      <div className="absolute right-[8%] top-[46%] h-7 w-7 rounded-full bg-[#8c3e32]" />
      <div className="absolute bottom-[18%] left-[22%] h-3 w-8 -rotate-6 rounded-sm bg-[#c4b08a]" />
      <div className="absolute bottom-[22%] right-[20%] h-3 w-10 rotate-12 rounded-sm bg-[#b89a72]" />
      {faded ? (
        <>
          <div className="absolute bottom-[8%] left-[40%] h-2 w-6 rounded-full bg-[#6a4a32]" />
          <div className="absolute bottom-[14%] right-[36%] h-2 w-4 rounded-full bg-[#5a3e2a]" />
        </>
      ) : (
        <div className="absolute bottom-[28%] left-[58%] flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3a2a22]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#3a2a22]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#3a2a22]" />
        </div>
      )}
    </div>
  );
}
