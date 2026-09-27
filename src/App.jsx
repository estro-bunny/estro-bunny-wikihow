import { useMemo, useState } from "react";

const levels = [
  { id: 0, name: "NORMAL", color: "cyan", desc: "Form 19-C is behaving normally." },
  { id: 1, name: "UNUSUAL PAPERWORK", color: "yellow", desc: "A new form has appeared unexpectedly." },
  { id: 2, name: "CONTRADICTORY", color: "orange", desc: "Two documents now disagree." },
  { id: 3, name: "SELF-REPLICATION", color: "red", desc: "Additional copies are appearing." },
  { id: 4, name: "BUREAUCRATIC RECURSION", color: "red", desc: "The forms require each other." },
  { id: 5, name: "ADMINISTRATIVE CATASTROPHE", color: "magenta", desc: "A form explaining a form has appeared." }
];
const checklistSeed = ["Original Form 19-C identified","Current version preserved","Contradictory instructions recorded","Photocopier secured","Printer secured","Unnecessary stationery removed","Authoritative clarification requested","EstroBunny removed from the printer area","Greg kept outside the evidence register","Rubber ducks accounted for"];
const initialLogs = [
  ["21:14:02","SYSTEM","Form 19-C containment console initialized."],
  ["21:14:09","SCAN","Original document located. No immediate replication detected."],
  ["21:14:31","WARN","Form 19-C(a) references Form 19-C(b)."],
  ["21:14:32","WARN","Form 19-C(b) references Form 19-C(a)."],
  ["21:14:47","ESTROBUNNY","I have an idea."],
  ["21:14:48","SYSTEM","ESCALATION RECOMMENDED."]
];

export default function App() {
  const [level,setLevel] = useState(3);
  const [copies,setCopies] = useState(3);
  const [ducks,setDucks] = useState(6);
  const [terminal,setTerminal] = useState(false);
  const [checklist,setChecklist] = useState(() => Object.fromEntries(checklistSeed.map((_,i)=>[i,false])));
  const [logs,setLogs] = useState(initialLogs);
  const current = levels[level];
  const completed = Object.values(checklist).filter(Boolean).length;
  const containment = Math.round(completed / checklistSeed.length * 100);
  const state = level >= 5 ? "CATASTROPHIC" : level >= 3 ? "ACTIVE" : "STABLE";
  const progress = useMemo(() => [8,30,55,76,92,100][level], [level]);

  const addLog = (source,message) => setLogs(items => [...items,[new Date().toLocaleTimeString("en-ZA",{hour12:false}),source,message]].slice(-10));
  const escalate = (next = Math.min(5,level+1)) => { setLevel(next); setCopies(n=>n+(next>=3?1:0)); addLog("ALERT",`Alert level raised to ${next}: ${levels[next].name}.`); };
  const toggle = i => setChecklist(s=>({...s,[i]:!s[i]}));
  const contain = () => { setLevel(2); setCopies(n=>Math.max(3,n-1)); addLog("CONTAINMENT","Containment attempt initiated. Paperwork freeze active."); };
  const openTerminal = () => { setTerminal(true); addLog("ESTROBUNNY","Terminal opened. Documentation Team notified."); };

  return <div className={`app level-${level}`}>
    <div className="scanlines"/>
    <header className="topbar">
      <div className="brand"><div className="bunny-mark">૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა</div><div><strong>ESTROBUNNY // WIKIHOW</strong><span>ADMINISTRATIVE ANOMALY CONTAINMENT NETWORK</span></div></div>
      <div className="top-status"><span className="dot"/> SYSTEM ONLINE <span className="version">EB-IR-19C / v0.1</span></div>
    </header>
    <main>
      <section className="hero panel">
        <div className="hero-copy"><div className="eyebrow">☣ DOCUMENT CONTAINMENT PROTOCOL</div><h1>FORM <span>19-C</span></h1><p className="subtitle">SELF-REPLICATING BUREAUCRATIC ANOMALY</p><p className="lede">A dead-serious control console for paperwork that has stopped respecting the laws of paperwork.</p><div className="hero-actions"><button className="primary" onClick={()=>escalate()}>RAISE ALERT LEVEL</button><button className="secondary" onClick={contain}>ATTEMPT CONTAINMENT</button></div></div>
        <div className="hero-core"><div className="core-ring"><span>19-C</span></div><div className="core-label">DOCUMENT<br/>ISOLATION</div></div>
      </section>
      <section className="telemetry-grid">
        <Metric label="ALERT LEVEL" value={level} note={current.name} color={current.color}/>
        <Metric label="KNOWN COPIES" value={copies} note="↑ replication detected"/>
        <Metric label="CONTAINMENT" value={`${containment}%`} note={`${completed}/${checklistSeed.length} controls active`}/>
        <Metric label="DUCKS RECOVERED" value={<>{ducks}<em>/7</em></>} note={ducks===7?"All accounted for":"One duck remains missing"}/>
      </section>
      <section className="dashboard-grid">
        <article className="panel alert-panel"><PanelHead eyebrow="CURRENT CONDITION" title="RED-ALERT MATRIX" badge={<span className={`state-badge ${current.color}`}>{state}</span>}/><div className="level-list">{levels.map(item=><button key={item.id} className={`level-row ${item.id===level?"selected":""}`} onClick={()=>setLevel(item.id)}><span className={`level-index ${item.color}`}>{item.id}</span><span className="level-info"><b>{item.name}</b><small>{item.desc}</small></span><span className="chevron">›</span></button>)}</div></article>
        <article className="panel checklist-panel"><PanelHead eyebrow="RESPONSE PROTOCOL" title="CONTAINMENT CHECKLIST" badge={<span className="count">{completed}/{checklistSeed.length}</span>}/><div className="progress"><span style={{width:`${progress}%`}}/></div><div className="checks">{checklistSeed.map((item,i)=><label className={checklist[i]?"checked":""} key={item}><input type="checkbox" checked={!!checklist[i]} onChange={()=>toggle(i)}/><span className="fake-check">✓</span><span>{item}</span></label>)}</div></article>
      </section>
      <section className="lower-grid">
        <article className="panel log-panel"><PanelHead eyebrow="LIVE TELEMETRY" title="INCIDENT LOG" badge={<span className="live"><i/> LIVE</span>}/><div className="log-window">{logs.slice(-8).map(([time,source,msg],i)=><div className="log-line" key={time+i}><time>{time}</time><b>{source}</b><span>{msg}</span></div>)}</div></article>
        <article className="panel rules-panel"><PanelHead eyebrow="HANDLING DIRECTIVE" title="DO NOT" badge={<span className="danger">NOPE</span>}/><ul><li>Photocopy Form 19-C without authorization.</li><li>Create <code>Form 19-D</code>.</li><li>Combine contradictory instructions “to save time.”</li><li>Ask Greg to interpret the paperwork.</li><li>Open another terminal to automate the process.</li></ul><div className="directive">DO NOT ATTEMPT TO OUT-PAPERWORK THE PAPERWORK.</div></article>
      </section>
      <section className="incident-strip panel"><div><span className="eyebrow">EMERGENCY ESCALATION</span><h2>THE PAPERWORK IS NOT MALICIOUS.</h2><p>It is simply following the instructions.</p></div><button className="danger-button" onClick={()=>escalate(5)}>DECLARE LEVEL 5</button></section>
      <section className="terminal panel"><div className="terminal-head"><div className="traffic"><i/><i/><i/></div><span>estrobunny@containment:~</span><button onClick={openTerminal}>{terminal?"TERMINAL ACTIVE":"OPEN TERMINAL"}</button></div><pre>{terminal ? `$ ./contain-form-19c
> Loading containment protocol...
> Original document: FOUND
> Copies: ${copies}
> Alert level: ${level}
> Containment: ${containment}%
> Greg: NOT AUTHORIZED
> Photocopier: SECURED
> EstroBunny: "I have an idea."

SYSTEM:
Please step away from the keyboard.

EstroBunny:
but what if—

SYSTEM:
NO.

$ _` : `$ ./contain-form-19c
> containment console ready
> type "open-terminal" if you absolutely must make this worse

$ _`}</pre></section>
    </main>
    <footer><span>ESTROBUNNY WIKIHOW // EB-IR-19C</span><span>still here 🏳️‍⚧️</span><span>STATUS: {state}</span></footer>
  </div>;
}

function Metric({label,value,note,color}) { return <article className="metric panel"><span>{label}</span><strong className={color}>{value}</strong><small>{note}</small></article>; }
function PanelHead({eyebrow,title,badge}) { return <div className="panel-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{badge}</div>; }