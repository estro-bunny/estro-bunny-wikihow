import { useEffect, useMemo, useState } from "react";

const CHAOS_LINES = {
  1: ["Proceed normally. Somehow.", "This is still a legitimate document."],
  2: ["Something feels suspicious. Continue anyway.", "We have crossed into the questionable zone."],
  3: ["Excellent. The situation is now concerning.", "Please remain calm while the documentation stops being helpful."],
  4: ["OH NO. WE HAVE ENTERED THE CHAOTIC PHASE.", "This was supposed to be a normal procedure.", "EstroBunny has been notified. This is not reassuring."],
  5: ["ESTROBUNNY PROTOCOL ENGAGED.", "The bunny has seen the logs. The bunny has opinions.", "We are no longer pretending this is normal."],
  6: ["ABSOLUTELY NOT. NARRATOR OVERRIDE ACTIVE.", "Whatever happens next is technically documented.", "Do not make eye contact with the incident."],
  7: ["DOCUMENTATION HAS FAILED.", "The narrator is now the incident commander.", "If you are still listening, congratulations on your terrible decision-making."]
};

function cleanMarkdown(markdown) {
  return markdown
    .replace(/:::([a-z]+)(?:\s+[^\n]*)?\n[\s\S]*?\n:::/gi, " ")
    .replace(/^---[\s\S]*?---\s*/m, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/```[\s\S]*?```/g, " Code block omitted. ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/>{1,}\s?/g, "")
    .replace(/\|/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildSegments(article) {
  const lines = cleanMarkdown(article.body).split(/\n+/).map(line => line.trim()).filter(Boolean);
  const intro = `Welcome to EstroBunny WikiHow. Today we are dealing with: ${article.title}.`;
  const chaos = CHAOS_LINES[Math.min(7, Math.max(1, Number(article.chaos) || 1))] || CHAOS_LINES[3];
  const segments = [{ type: "narrator", text: intro }];
  let chaosIndex = 0;
  for (const line of lines) {
    const sentences = line.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [line];
    for (const sentence of sentences) {
      const text = sentence.trim();
      if (!text) continue;
      segments.push({ type: "article", text });
      if (/[.!?]$/.test(text) && text.length > 110) {
        segments.push({ type: "narrator", text: chaos[chaosIndex % chaos.length] });
        chaosIndex += 1;
      }
    }
  }
  segments.push({ type: "narrator", text: article.chaos >= 6 ? "The document is complete. The consequences are not." : "That concludes the procedure. Please make better decisions next time." });
  return segments;
}

export default function Narrator({ article }) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const segments = useMemo(() => buildSegments(article), [article]);
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(-1);
  const [mode, setMode] = useState("unhinged");
  const [rate, setRate] = useState(1.08);
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supported) return undefined;
    const load = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (voiceIndex < 0 && available.length) {
        const preferred = available.findIndex(voice => /en(-|_)?(ZA|GB|AU|US)/i.test(voice.lang));
        setVoiceIndex(preferred >= 0 ? preferred : 0);
      }
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported, voiceIndex]);

  useEffect(() => () => {
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  const speakFrom = startIndex => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const nextIndex = Math.max(0, Math.min(startIndex, segments.length - 1));
    setIndex(nextIndex);
    setError("");
    let cursor = nextIndex;
    const speakNext = () => {
      if (cursor >= segments.length) {
        setSpeaking(false);
        setPaused(false);
        return;
      }
      const segment = segments[cursor];
      const utterance = new SpeechSynthesisUtterance(segment.text);
      const selectedVoice = voices[voiceIndex];
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.lang = selectedVoice?.lang || "en-US";
      utterance.rate = mode === "maximum" ? Math.min(1.45, rate + 0.12) : mode === "calm" ? Math.max(0.75, rate - 0.12) : rate;
      utterance.pitch = segment.type === "narrator" ? (mode === "maximum" ? 1.22 : 1.08) : 1;
      utterance.volume = 1;
      utterance.onstart = () => { setSpeaking(true); setPaused(false); setIndex(cursor); };
      utterance.onend = () => { cursor += 1; if (cursor < segments.length) window.setTimeout(speakNext, segment.type === "narrator" ? 240 : 80); else { setSpeaking(false); setPaused(false); } };
      utterance.onerror = event => { if (event.error !== "canceled" && event.error !== "interrupted") { setError("VOICE SYSTEM ERROR: " + event.error); setSpeaking(false); } };
      window.speechSynthesis.speak(utterance);
    };
    speakNext();
  };

  const togglePause = () => {
    if (!supported) return;
    if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); setPaused(false); return; }
    if (window.speechSynthesis.speaking) { window.speechSynthesis.pause(); setPaused(true); }
  };

  if (!supported) return <div className="narrator panel narrator-unavailable"><strong>VOICE SYSTEM UNAVAILABLE.</strong><span>Your browser does not expose Speech Synthesis. The documentation has defeated you.</span></div>;

  const current = segments[index];
  const progress = Math.round(((index + (speaking ? 1 : 0)) / segments.length) * 100);

  return <section className="narrator panel" aria-label="EstroBunny narrator">
    <div className="narrator-head">
      <div><div className="eyebrow">ESTROBUNNY NARRATOR // AUDIO CONTAINMENT</div><h2>FUCK READING. PRESS PLAY.</h2></div>
      <span className={speaking ? "narrator-live" : "narrator-idle"}>{speaking ? "● LIVE" : "○ STANDBY"}</span>
    </div>
    <div className="narrator-display">
      <span className="narrator-avatar">૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა</span>
      <p>{current?.text || "Narrator standing by. The documentation is judging you."}</p>
    </div>
    <div className="narrator-controls">
      <button className="narrator-primary" onClick={() => speaking ? togglePause() : speakFrom(index)}>{speaking ? (paused ? "▶ RESUME" : "Ⅱ PAUSE") : "▶ NARRATE"}</button>
      <button onClick={() => speakFrom(0)}>↻ START OVER</button>
      <button onClick={stop}>■ STOP</button>
      <button onClick={() => speakFrom(Math.min(index + 1, segments.length - 1))}>SKIP →</button>
    </div>
    <div className="narrator-settings">
      <label>MODE<select value={mode} onChange={e => { stop(); setMode(e.target.value); }}><option value="calm">CALM(ISH)</option><option value="unhinged">UNHINGED</option><option value="maximum">MAXIMUM BUNNY</option></select></label>
      <label>VOICE<select value={voiceIndex} onChange={e => setVoiceIndex(Number(e.target.value))}><option value={-1}>SYSTEM DEFAULT</option>{voices.map((voice, i) => <option key={voice.voiceURI || voice.name} value={i}>{voice.name} · {voice.lang}</option>)}</select></label>
      <label>RATE<input type="range" min="0.75" max="1.45" step="0.05" value={rate} onChange={e => setRate(Number(e.target.value))}/><span>{rate.toFixed(2)}×</span></label>
    </div>
    <div className="narrator-progress"><span style={{ width: progress + "%" }}/></div>
    <div className="narrator-status"><span>{index + 1}/{segments.length} SEGMENTS</span><span>{mode.toUpperCase()} MODE</span><span>{error || "AUDIO STABLE // PROBABLY"}</span></div>
  </section>;
}