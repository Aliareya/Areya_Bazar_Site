import React from "react";
import { Icon } from "@iconify/react";

// ---------------------------------------------------------------------------
// Design tokens — shared with Shop.jsx
// ---------------------------------------------------------------------------
const FOREST = "#23633a";        // brand primary
const FOREST_DEEP = "#163f26";   // darker forest, for depth/gradients
const CREAM = "#FBF7F0";         // warm page background
const ACCENT = "#f97316";        // warm accent (matches shop's orange)
const WALNUT = "#8B5E3C";        // wood tone, used sparingly
const INK = "#1E2620";           // warm near-black for body text

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');`;

// ---------------------------------------------------------------------------
// Signature element: a "grain strip" — a row of uneven ticks that reads like
// the growth rings on a cut plank. Used as a divider throughout the page to
// tie back to the material the whole brand is built on: wood.
// ---------------------------------------------------------------------------
function GrainStrip({ tone = "dark", className = "" }) {
  const bars = useGrainPattern();
  const color = tone === "dark" ? "rgba(255,255,255,0.5)" : "rgba(35,99,58,0.45)";
  return (
    <div className={`flex items-end gap-[3px] h-5 ${className}`} aria-hidden="true">
      {bars.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%`, background: color }}
          className="w-[2px] rounded-full"
        />
      ))}
    </div>
  );
}

// deterministic pseudo-random heights so the strip looks organic but doesn't
// reshuffle on every render
function useGrainPattern() {
  const seed = [40, 70, 55, 100, 45, 60, 35, 90, 50, 65, 42, 100, 58, 38, 75, 48, 100, 62, 44, 80, 52, 36, 95, 60, 46, 70, 40, 100, 55, 65];
  return seed;
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
function Eyebrow({ children, tone = "light" }) {
  return (
    <p
      className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
      style={{ color: tone === "light" ? "rgba(255,255,255,0.7)" : FOREST, fontFamily: "Inter, sans-serif" }}
    >
      {children}
    </p>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="text-center px-4">
      <p
        className="text-4xl sm:text-5xl font-semibold text-white"
        style={{ fontFamily: "Fraunces, serif" }}
      >
        {number}
      </p>
      <p className="text-sm text-white/60 mt-2 max-w-[16ch] mx-auto">{label}</p>
    </div>
  );
}

function ValueCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl p-7 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center mb-5"
        style={{ background: "rgba(35,99,58,0.1)" }}
      >
        <Icon icon={icon} className="w-5 h-5" style={{ color: FOREST }} />
      </div>
      <h3 className="font-semibold text-lg mb-2" style={{ color: INK }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(30,38,32,0.65)" }}>
        {children}
      </p>
    </div>
  );
}

function ProcessStep({ index, title, children, last = false }) {
  return (
    <div className="flex-1 relative">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-semibold w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: FOREST, color: "white", fontFamily: "Inter, sans-serif" }}
        >
          {index}
        </span>
        {!last && (
          <div className="hidden md:block flex-1 h-px" style={{ background: "rgba(35,99,58,0.2)" }} />
        )}
      </div>
      <h4 className="font-semibold mb-1.5" style={{ color: INK, fontFamily: "Fraunces, serif" }}>
        {title}
      </h4>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(30,38,32,0.6)" }}>
        {children}
      </p>
    </div>
  );
}

function TeamCard({ initials, name, role }) {
  return (
    <div className="text-center">
      <div
        className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-lg font-semibold mb-4"
        style={{ background: FOREST, color: "white", fontFamily: "Fraunces, serif" }}
      >
        {initials}
      </div>
      <h4 className="font-semibold" style={{ color: INK }}>{name}</h4>
      <p className="text-sm mt-0.5" style={{ color: "rgba(30,38,32,0.55)" }}>{role}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main About page
// ---------------------------------------------------------------------------
export default function About() {
  return (
    <div style={{ background: CREAM, fontFamily: "Inter, sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      {/* Breadcrumb */}
      <div className="text-center py-6" style={{ background: CREAM }}>
        <p className="text-sm" style={{ color: "rgba(30,38,32,0.5)" }}>Home / About</p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Hero — dark forest band                                          */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${FOREST} 0%, ${FOREST_DEEP} 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>Our Story</Eyebrow>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-[1.08] tracking-tight"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Furniture built to
              <br />
              outlast the trend.
            </h1>
            <GrainStrip tone="dark" className="mt-8 mb-8" />
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              We started Fernwood because most furniture is designed to be replaced,
              not repaired. Every piece we sell is made from solid materials, by
              independent workshops we've known for years — so it can be lived in,
              fixed, and passed down.
            </p>
            <div className="mt-9 flex items-center gap-4">
              <button
                className="inline-flex items-center gap-2 bg-white font-medium px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
                style={{ color: FOREST }}
              >
                Shop the collection
                <Icon icon="mdi:arrow-right" className="w-4 h-4" />
              </button>
              <button className="text-white/80 font-medium hover:text-white text-sm underline underline-offset-4">
                Meet the makers
              </button>
            </div>
          </div>

          {/* Image collage */}
          <div className="relative h-[420px] hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=80"
              alt="Upholstered sofa chair in a sunlit living room"
              className="absolute top-0 right-0 w-[75%] h-[75%] object-cover rounded-2xl shadow-2xl"
            />
            <img
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80"
              alt="Detail of a hand-finished wooden chair frame"
              className="absolute bottom-0 left-0 w-[55%] h-[55%] object-cover rounded-2xl shadow-2xl border-4"
              style={{ borderColor: CREAM }}
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Story                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Eyebrow tone="dark">Since 2011</Eyebrow>
            <h2
              className="text-3xl font-medium leading-tight"
              style={{ color: INK, fontFamily: "Fraunces, serif" }}
            >
              From one workshop in Roeselare to homes across the country.
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-lg leading-relaxed mb-5" style={{ color: "rgba(30,38,32,0.75)" }}>
              Fernwood began as a single carpentry bench and a frustration with
              flat-pack furniture that didn't survive a second move. Our founder,
              a trained joiner, started building sofa frames and nightstands for
              friends — solid oak and ash, joined the way furniture used to be
              joined, before veneer and staples became the norm.
            </p>
            <p className="leading-relaxed mb-8" style={{ color: "rgba(30,38,32,0.65)" }}>
              Word spread faster than the workshop could keep up with, so we
              partnered with a small network of independent makers who shared
              the same standard: real materials, visible joinery, and a
              willingness to stand behind what they build. That network is
              still who makes every piece you see in the shop today.
            </p>
            <div
              className="border-l-2 pl-5 italic text-lg"
              style={{ borderColor: ACCENT, color: INK, fontFamily: "Fraunces, serif" }}
            >
              "We don't design for the showroom. We design for the fifteenth year
              in your living room."
              <p className="not-italic text-sm mt-2" style={{ color: "rgba(30,38,32,0.5)", fontFamily: "Inter, sans-serif" }}>
                — Fernwood founding note, 2011
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stats — dark forest band                                         */}
      {/* ---------------------------------------------------------------- */}
      <section style={{ background: FOREST }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4">
            <StatCard number="14" label="years shaping rooms" />
            <StatCard number="3,200+" label="pieces crafted last year" />
            <StatCard number="62" label="independent workshops we build with" />
            <StatCard number="98%" label="of frames still in use after 10 years" />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Values                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-2xl mb-12">
          <Eyebrow tone="dark">What we hold to</Eyebrow>
          <h2 className="text-3xl font-medium" style={{ color: INK, fontFamily: "Fraunces, serif" }}>
            Three rules we don't bend on.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ValueCard icon="mdi:tree-outline" title="Material honesty">
            Solid wood, not veneer dressed up as walnut. Real down or high-density
            foam, listed on the tag — never a mystery fill.
          </ValueCard>
          <ValueCard icon="mdi:hand-back-right-outline" title="Slow craft">
            Our workshops build in small batches by hand. If a piece is backordered,
            it's because someone is still sanding it, not because a container is
            stuck at sea.
          </ValueCard>
          <ValueCard icon="mdi:wrench-outline" title="Made to be repaired">
            Every frame ships with the fittings to tighten or replace it. We'd
            rather sell you a replacement leg in year eight than a whole new chair.
          </ValueCard>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Process                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-20 lg:py-24" style={{ background: "rgba(35,99,58,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <Eyebrow tone="dark">How a piece is made</Eyebrow>
            <h2 className="text-3xl font-medium" style={{ color: INK, fontFamily: "Fraunces, serif" }}>
              Four steps, the same order every time.
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-10 md:gap-6">
            <ProcessStep index="01" title="Sourced">
              Kiln-dried oak, ash, and FSC-certified pine, bought directly from
              small sawmills we visit in person.
            </ProcessStep>
            <ProcessStep index="02" title="Shaped">
              Cut, joined, and sanded by hand in workshops of fewer than
              twelve people, using joinery you can see, not hide.
            </ProcessStep>
            <ProcessStep index="03" title="Finished">
              Oiled or upholstered to order, then quality-checked against a
              32-point list before it leaves the bench.
            </ProcessStep>
            <ProcessStep index="04" title="Delivered" last>
              Wrapped in reusable blankets, not foam peanuts, and carried in
              by a two-person crew who'll place it where you want it.
            </ProcessStep>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Team                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-2xl mb-14">
          <Eyebrow tone="dark">Who's behind it</Eyebrow>
          <h2 className="text-3xl font-medium" style={{ color: INK, fontFamily: "Fraunces, serif" }}>
            A small team, mostly in the workshop.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <TeamCard initials="ML" name="Mira Lund" role="Founder & Lead Designer" />
          <TeamCard initials="JK" name="Jonas Kerr" role="Head of Workshop" />
          <TeamCard initials="AT" name="Ana Torres" role="Materials Sourcing" />
          <TeamCard initials="DP" name="Dev Patil" role="Customer Care Lead" />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA — dark forest band                                           */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${FOREST_DEEP} 0%, ${FOREST} 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2
            className="text-3xl sm:text-4xl font-medium text-white mb-4"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Ready to furnish the next chapter?
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-9">
            Browse the collection, or get in touch if you'd like something
            built to a size that doesn't exist yet.
          </p>
          <GrainStrip tone="dark" className="mx-auto mb-9 justify-center" />
          <div className="flex items-center justify-center gap-4">
            <button
              className="inline-flex items-center gap-2 bg-white font-medium px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
              style={{ color: FOREST }}
            >
              Shop the collection
              <Icon icon="mdi:arrow-right" className="w-4 h-4" />
            </button>
            <button
              className="inline-flex items-center gap-2 font-medium px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Contact us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}