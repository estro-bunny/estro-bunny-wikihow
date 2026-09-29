import { useState } from "react";

const states = [
  {
    level: "REASONABLE",
    title: "WORKING TREE APPEARS NORMAL",
    detail: "git status reports a clean tree. This is usually good news.",
    tone: "text-[#71ffad] border-[rgba(113,255,173,.25)]"
  },
  {
    level: "SUSPICIOUS",
    title: "COMMIT LOCATED",
    detail: "The regrettable commit is real. Unfortunately, so is the commit message.",
    tone: "text-[#ffe36e] border-[rgba(255,227,110,.25)]"
  },
  {
    level: "CONCERNING",
    title: "46 MODIFIED FILES",
    detail: "You were looking for one bad change. The repository has provided several.",
    tone: "text-[#ffb05f] border-[rgba(255,176,95,.25)]"
  },
  {
    level: "CHAOTIC",
    title: "CSS HAS ENTERED THE INCIDENT",
    detail: "A suspicious !important appears to be load-bearing. Nobody remembers why.",
    tone: "text-[var(--pink)] border-[rgba(255,79,216,.3)]"
  },
  {
    level: "ESTROBUNNY",
    title: "DOCUMENTATION IS NOW EVIDENCE",
    detail: "The interface is recording your decisions. Stop making new ones.",
    tone: "text-[var(--cyan)] border-[rgba(85,217,255,.3)]"
  },
  {
    level: "DOCUMENTATION HAS FAILED",
    title: "THE INCIDENT HAS BEEN DOCUMENTED",
    detail: "Further interaction is not recommended. Return to Step 1.",
    tone: "text-white border-[rgba(255,255,255,.22)]"
  }
];

export default function ChaosInteraction() {
  const [index, setIndex] = useState(0);
  const current = states[index];
  const finished = index === states.length - 1;

  return (
    <section
      className="my-6 border border-[rgba(255,79,216,.2)] bg-[rgba(7,5,11,.82)] p-5 shadow-[0_18px_60px_rgba(0,0,0,.25)]"
      aria-label="One-mechanic chaos demonstration"
    >
      <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[9px] font-extrabold tracking-[.1em] text-[var(--muted)]">
        <span>INTERACTIVE INCIDENT // ONE MECHANIC</span>
        <span>{index + 1}/{states.length}</span>
      </div>

      <div className={`border bg-[rgba(255,255,255,.02)] p-4 ${current.tone}`} aria-live="polite">
        <div className="font-mono text-[9px] font-extrabold tracking-[.12em]">{current.level}</div>
        <h3 className="mt-2 font-mono text-[17px] font-extrabold leading-tight text-white">{current.title}</h3>
        <p className="mt-2 text-[12px] leading-[1.55] text-[var(--muted)]">{current.detail}</p>
      </div>

      <button
        type="button"
        className="mt-3 w-full border border-[rgba(255,79,216,.3)] bg-[rgba(255,79,216,.06)] p-3 font-mono text-[10px] font-extrabold tracking-[.08em] text-[var(--pink)] transition-colors hover:bg-[rgba(255,79,216,.12)] focus:outline-none focus:ring-2 focus:ring-[var(--pink)] disabled:cursor-not-allowed disabled:opacity-45"
        onClick={() => setIndex(value => Math.min(value + 1, states.length - 1))}
        disabled={finished}
      >
        {finished ? "INCIDENT DOCUMENTED" : "INSPECT HEAD →"}
      </button>
    </section>
  );
}
