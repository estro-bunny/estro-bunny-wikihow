import { useEffect, useMemo, useRef, useState } from "react";

const REACTION_MUTE_STORAGE_KEY = "estrobunny-narrator-reaction-mutes";
const DEFAULT_REACTION_MUTES = { diagram: false, example: false, decorative: false };

function loadReactionMutes() {
  if (typeof window === "undefined") return DEFAULT_REACTION_MUTES;
  try {
    const saved = JSON.parse(window.localStorage.getItem(REACTION_MUTE_STORAGE_KEY) || "{}");
    return { ...DEFAULT_REACTION_MUTES, diagram: Boolean(saved.diagram), example: Boolean(saved.example), decorative: Boolean(saved.decorative) };
  } catch {
    return DEFAULT_REACTION_MUTES;
  }
}

const REACTIONS = {
  heading: ["New section detected. Let us pretend this was planned.", "Attention. The documentation has acquired another heading.", "Narrator note: this part apparently matters."],
  warning: ["WARNING. WARNING. THE DOCUMENT JUST RAISED ITS VOICE.", "Oh, good. A warning. My favorite genre of paperwork.", "Everyone remain calm. This box is absolutely not reassuring."],
  code: ["Code detected. I will not read it aloud because I respect your remaining sanity.", "Technical artifact detected. The bunny refuses to narrate every semicolon.", "A code block. Fascinating. Horrifying. We are skipping the incantation."],
  completion: ["COMPLETION STATE DETECTED. WE MAY HAVE SURVIVED.", "The procedure claims to be complete. I remain skeptical.", "Completion confirmed. The consequences are now someone elses problem."],
  diagram: ["Diagram detected. Please observe the arrows while I pretend this architecture makes sense.", "A diagram. Because apparently words were no longer sufficient to contain the situation.", "VISUAL SYSTEMS ONLINE. Follow the boxes. Respect the arrows. Fear the unlabeled line."],
  example: ["Example detected. Here is the part where theory puts on a tiny safety vest and enters the real world.", "Worked example incoming. Someone has volunteered their mistake for educational purposes.", "EXAMPLE STATE DETECTED. Please watch carefully as the documentation demonstrates the consequences."],
  decorative: ["Decorative visual detected. It contributes nothing operationally. Naturally, I approve.", "A decorative visual. The document has accessorized.", "Visual garnish detected. No procedure required. Continue pretending this is normal."]
};

function stripInline(markdown) {
  return markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/_([^_]+)_/g, "$1").replace(/>{1,}\s?/g, "").replace(/\|/g, " ").trim();
}

function sentenceChunks(text, maxSentences = 2) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks = [];
  for (let i = 0; i < sentences.length; i += maxSentences) {
    const chunk = sentences.slice(i, i + maxSentences).join(" ").trim();
    if (chunk) chunks.push(chunk);
  }
  return chunks;
}

function reaction(type, index = 0) {
  const pool = REACTIONS[type] || REACTIONS.heading;
  return { type: "reaction-" + type, text: pool[index % pool.length] };
}

function buildSegments(article) {
  const raw = String(article.body || "").replace(/\r\n?/g, "\n");
  const lines = raw.split("\n");
  const chaosLevel = Math.min(7, Math.max(1, Number(article.chaos) || 1));
  const segments = [{ type: "intro", text: "Welcome to EstroBunny WikiHow. Today we are dealing with: " + article.title + "." }];
  let reactionIndex = 0;
  let index = 0;
  let paragraph = [];
  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = stripInline(paragraph.join(" ")).replace(/\s+/g, " ").trim();
    paragraph = [];
    if (!text) return;
    sentenceChunks(text).forEach(chunk => segments.push({ type: "article", text: chunk }));
  };
  while (index < lines.length) {
    const trimmed = lines[index].trim();
    if (/^```|^~~~/.test(trimmed)) {
      flushParagraph();
      const marker = trimmed[0];
      const language = trimmed.slice(3).trim().split(/\s+/)[0] || "plain text";
      let codeLines = 0;
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith(marker.repeat(3))) { codeLines += 1; index += 1; }
      segments.push({ type: "code", text: "Code block detected. Language: " + language + ". " + codeLines + " lines of executable witchcraft have been quarantined." });
      segments.push(reaction("code", reactionIndex++));
      index += 1;
      continue;
    }
    const heading = trimmed.match(/^#{1,6}\s+(.+)$/);
    if (heading) {
      flushParagraph();
      segments.push({ type: "heading", text: stripInline(heading[1]) });
      segments.push(reaction("heading", reactionIndex++));
      index += 1;
      continue;
    }
    const directive = trimmed.match(/^:::(hero|step|diagram|warning|example|completion|decorative)(?:\s+(.*))?$/i);
    if (directive) {
      flushParagraph();
      const kind = directive[1].toLowerCase();
      const args = stripInline(directive[2] || "");
      const block = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== ":::") { block.push(lines[index]); index += 1; }
      if (kind === "warning") {
        const body = stripInline(block.filter(item => !/^\s*!\[/.test(item)).join(" ")).replace(/\s+/g, " ").trim();
        const detail = body ? sentenceChunks(body, 1)[0] : "";
        segments.push({ type: "warning", text: "Warning state" + (args ? ": " + args : "") + "." + (detail ? " " + detail : "") });
        segments.push(reaction("warning", reactionIndex++));
      } else if (kind === "completion") {
        const body = stripInline(block.join(" ")).replace(/\s+/g, " ").trim();
        const detail = body ? sentenceChunks(body, 1)[0] : "Against all available evidence, we appear to be finished.";
        segments.push({ type: "completion", text: (args || "Procedure complete") + ". " + detail });
        segments.push(reaction("completion", reactionIndex++));
      } else if (kind === "diagram" || kind === "example" || kind === "decorative") {
        const image = block.find(item => /^\s*!\[/.test(item));
        const imageMatch = image?.match(/^\s*!\[([^\]]*)\]\([^)]*\)/);
        const alt = stripInline(imageMatch?.[1] || "").replace(/\s+/g, " ").trim();
        const body = stripInline(block.filter(item => !/^\s*!\[/.test(item)).join(" ")).replace(/\s+/g, " ").trim();
        const detail = args || alt || (body ? sentenceChunks(body, 1)[0] : "");
        if (kind === "diagram") {
          segments.push({ type: "diagram", text: "Diagram detected" + (detail ? ": " + detail : "") + ". The narrator will describe the visual state, not recite every box and arrow." });
          segments.push(reaction("diagram", reactionIndex++));
        } else if (kind === "example") {
          segments.push({ type: "example", text: "Example visual detected" + (detail ? ": " + detail : "") + ". Observe the evidence. Do not become the evidence." });
          segments.push(reaction("example", reactionIndex++));
        } else {
          segments.push({ type: "decorative", text: "Decorative visual detected" + (detail ? ": " + detail : "") + ". No operational response required." });
          segments.push(reaction("decorative", reactionIndex++));
        }
      }
      index += 1;
      continue;
    }
    if (!trimmed || /^---+$/.test(trimmed)) { flushParagraph(); index += 1; continue; }
    paragraph.push(trimmed);
    index += 1;
  }
  flushParagraph();
  segments.push({ type: "finale", text: chaosLevel >= 6 ? "The document is complete. The consequences are not." : "That concludes the procedure. Please make better decisions next time." });
  return segments;
}

function segmentVoiceSettings(segment, mode, rate) {
  const kind = segment.type.startsWith("reaction-") ? segment.type.slice(9) : segment.type;
  const isReaction = segment.type.startsWith("reaction-");
  const isAlarm = kind === "warning";
  const isFinale = kind === "completion" || kind === "finale";
  const isDiagram = kind === "diagram";
  const isExample = kind === "example";
  const isDecorative = kind === "decorative";
  return {
    rate: mode === "maximum" ? Math.min(1.5, rate + (isReaction ? 0.16 : 0.08)) : mode === "calm" ? Math.max(0.75, rate - 0.12) : rate + (isReaction ? 0.02 : 0) + (isDiagram ? -0.08 : isExample ? 0.03 : isDecorative ? 0.12 : 0),
    pitch: isAlarm ? 1.32 : isFinale ? 1.16 : isDiagram ? 0.98 : isExample ? 1.05 : isDecorative ? 1.22 : isReaction ? 1.12 : kind === "code" ? 0.94 : 1,
    volume: isAlarm || isFinale || isDiagram ? 1 : 0.96
  };
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
  const [mutedReactions, setMutedReactions] = useState(loadReactionMutes);
  const cursorRef = useRef(0);
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
  useEffect(() => {
    try {
      window.localStorage.setItem(REACTION_MUTE_STORAGE_KEY, JSON.stringify(mutedReactions));
    } catch {
      // Storage can be unavailable in private/restricted browser contexts.
    }
  }, [mutedReactions]);
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);
  const stop = () => { if (!supported) return; window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); };
  const speakFrom = startIndex => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const nextIndex = Math.max(0, Math.min(startIndex, segments.length - 1));
    setIndex(nextIndex);
    setError("");
    let cursor = nextIndex;
    cursorRef.current = cursor;
    const speakNext = () => {
      if (cursor >= segments.length) { setSpeaking(false); setPaused(false); return; }
      const segment = segments[cursor];
      cursorRef.current = cursor;
      const reactionType = segment.type.startsWith("reaction-") ? segment.type.slice(9) : null;
      if (reactionType && mutedReactions[reactionType]) {
        setIndex(cursor);
        cursor += 1;
        window.setTimeout(speakNext, 40);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(segment.text);
      const selectedVoice = voices[voiceIndex];
      const settings = segmentVoiceSettings(segment, mode, rate);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.lang = selectedVoice?.lang || "en-US";
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      utterance.onstart = () => { setSpeaking(true); setPaused(false); setIndex(cursor); };
      utterance.onend = () => { cursor += 1; if (cursor < segments.length) { const delay = segments[cursor].type.startsWith("reaction-") ? 420 : segment.type.startsWith("reaction-") ? 280 : 90; window.setTimeout(speakNext, delay); } else { setSpeaking(false); setPaused(false); } };
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
  const skipCurrentReaction = () => {
    const currentSegment = segments[cursorRef.current];
    if (!currentSegment?.type?.startsWith("reaction-")) return;
    window.speechSynthesis.cancel();
    const nextIndex = Math.min(cursorRef.current + 1, segments.length - 1);
    setIndex(nextIndex);
    setPaused(false);
    setSpeaking(true);
    speakFrom(nextIndex);
  };
  const replayCurrentReaction = () => {
    const currentSegment = segments[cursorRef.current];
    if (!currentSegment?.type?.startsWith("reaction-")) return;
    speakFrom(cursorRef.current);
  };
  const toggleReactionMute = type => {
    setMutedReactions(previous => ({ ...previous, [type]: !previous[type] }));
  };
  const setReactionMute = (type, muted) => {
    setMutedReactions(previous => ({ ...previous, [type]: muted }));
  };
  if (!supported) return <div className="narrator panel narrator-unavailable"><strong>VOICE SYSTEM UNAVAILABLE.</strong><span>Your browser does not expose Speech Synthesis. The documentation has defeated you.</span></div>;
  const current = segments[index];
  const progress = Math.round(((index + (speaking ? 1 : 0)) / segments.length) * 100);
  const typeLabel = current?.type?.startsWith("reaction-") ? "NARRATOR REACTION" : (current?.type || "standby").toUpperCase();
  return <section className="narrator panel" aria-label="EstroBunny narrator">
    <div className="narrator-head"><div><div className="eyebrow">ESTROBUNNY NARRATOR // AUDIO CONTAINMENT</div><h2>FUCK READING. PRESS PLAY.</h2></div><span className={speaking ? "narrator-live" : "narrator-idle"}>{speaking ? "● LIVE" : "○ STANDBY"}</span></div>
    <div className={"narrator-display narrator-display--" + (current?.type || "idle")}><span className="narrator-avatar">૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა</span><div><small className="narrator-segment-type">{typeLabel}</small><p>{current?.text || "Narrator standing by. The documentation is judging you."}</p></div></div>
    <div className="narrator-controls"><button className="narrator-primary" onClick={() => speaking ? togglePause() : speakFrom(index)}>{speaking ? (paused ? "▶ RESUME" : "Ⅱ PAUSE") : "▶ NARRATE"}</button><button onClick={() => speakFrom(0)}>↻ START OVER</button><button onClick={stop}>■ STOP</button><button onClick={() => speakFrom(Math.min(index + 1, segments.length - 1))}>SKIP →</button></div><div className="narrator-reaction-controls" aria-label="Visual reaction controls"><span className="narrator-reaction-label">VISUAL REACTIONS</span>{["diagram","example","decorative"].map(type => <div className="narrator-reaction-control" key={type}><span>{type.toUpperCase()}</span><span className={"narrator-reaction-state " + (mutedReactions[type] ? "is-muted" : "is-enabled")} aria-label={type.toUpperCase() + " reactions are " + (mutedReactions[type] ? "muted" : "enabled")}>{mutedReactions[type] ? "● MUTED" : "● ON"}</span><button onClick={skipCurrentReaction} disabled={current?.type !== "reaction-" + type}>SKIP</button><button onClick={replayCurrentReaction} disabled={current?.type !== "reaction-" + type}>REPLAY</button><button className={"narrator-reaction-mute-button " + (mutedReactions[type] ? "is-muted" : "is-enabled")} onClick={() => toggleReactionMute(type)} aria-pressed={mutedReactions[type]} aria-label={(mutedReactions[type] ? "Unmute " : "Mute ") + type + " reactions"}>{mutedReactions[type] ? "UNMUTE" : "MUTE"}</button></div>)}</div><div className="narrator-reaction-settings" aria-label="Saved visual reaction settings"><div><strong>REACTION SETTINGS</strong><span>Saved across articles and narrator sessions.</span></div>{["diagram","example","decorative"].map(type => <label className="narrator-reaction-setting" key={type}><span><strong>{type.toUpperCase()}</strong><small>{mutedReactions[type] ? "MUTED" : "ENABLED"} // SAVED</small></span><input type="checkbox" checked={mutedReactions[type]} onChange={event => setReactionMute(type, event.target.checked)} aria-label={"Mute " + type + " reactions"} /><b>{mutedReactions[type] ? "MUTED" : "ON"}</b></label>)}</div>
    <div className="narrator-settings"><label>MODE<select value={mode} onChange={e => { stop(); setMode(e.target.value); }}><option value="calm">CALM(ISH)</option><option value="unhinged">UNHINGED</option><option value="maximum">MAXIMUM BUNNY</option></select></label><label>VOICE<select value={voiceIndex} onChange={e => setVoiceIndex(Number(e.target.value))}><option value={-1}>SYSTEM DEFAULT</option>{voices.map((voice, i) => <option key={voice.voiceURI || voice.name} value={i}>{voice.name} · {voice.lang}</option>)}</select></label><label>RATE<input type="range" min="0.75" max="1.45" step="0.05" value={rate} onChange={e => setRate(Number(e.target.value))}/><span>{rate.toFixed(2)}×</span></label></div>
    <div className="narrator-progress"><span style={{ width: progress + "%" }}/></div>
    <div className="narrator-status"><span>{index + 1}/{segments.length} SEGMENTS</span><span>{mode.toUpperCase()} MODE</span><span>{error || "AUDIO STABLE // PROBABLY"}</span></div>
  </section>;
}