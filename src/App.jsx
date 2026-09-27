import { useEffect, useMemo, useRef, useState } from "react";

const articleFiles = import.meta.glob("../articles/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true
});

const categoryLabels = {
  coding: "💻 Coding",
  "internet-chaos": "🌐 Internet Chaos",
  life: "🧠 Life",
  bureaucracy: "⚖️ Bureaucracy",
  adventure: "🏴‍☠️ Adventure",
  villainy: "🦹 Villainy",
  "fictional-crime": "🕵️ Fictional Crime",
  emergency: "🚨 Emergency",
  "technical-operations": "🔧 Technical Operations",
  "estro-bunny": "🐰 EstroBunny",
  "questionable-decisions": "❓ Questionable Decisions"
};

const typeLabels = {
  guide: "GUIDE",
  procedure: "PROCEDURE",
  runbook: "RUNBOOK",
  incident: "INCIDENT",
  containment: "CONTAINMENT",
  checklist: "CHECKLIST",
  template: "TEMPLATE",
  reference: "REFERENCE",
  memo: "MEMO",
  "field-manual": "FIELD MANUAL",
  "case-file": "CASE FILE",
  redacted: "REDACTED"
};

const chaosLabels = {
  1: "🟢 REASONABLE",
  2: "🟡 SUSPICIOUS",
  3: "🟠 CONCERNING",
  4: "🔴 CHAOTIC",
  5: "🟣 ESTROBUNNY",
  6: "⚫ ABSOLUTELY NOT",
  7: "☢️ DOCUMENTATION HAS FAILED"
};

function parseFrontmatter(raw, path) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const lines = match[1].split("\n");
  const meta = { characters: [], tags: [] };
  let listKey = null;
  for (const line of lines) {
    if (/^\s*- /.test(line) && listKey) {
      meta[listKey].push(line.replace(/^\s*- /, "").trim());
      continue;
    }
    const pair = line.match(/^([\w-]+):\s*(.*)$/);
    if (!pair) continue;
    const key = pair[1];
    let value = pair[2].trim();
    if (value === "") {
      if (key === "characters" || key === "tags") {
        listKey = key;
        meta[key] = [];
      }
      continue;
    }
    listKey = null;
    if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (/^\d+$/.test(value)) value = Number(value);
    else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    meta[key] = value;
  }
  return { ...meta, path, body: match[2].trim() };
}

const articles = Object.entries(articleFiles)
  .map(([path, raw]) => parseFrontmatter(raw, path))
  .filter(Boolean)
  .sort((a, b) => a.title.localeCompare(b.title));

const unique = key => [...new Set(articles.flatMap(a => Array.isArray(a[key]) ? a[key] : [a[key]]).filter(Boolean))].sort();

function slugFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "");
}

function routeSlug() {
  const match = window.location.pathname.match(/^\/articles\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function App() {
  const [view, setView] = useState("articles");
  const [route, setRoute] = useState(routeSlug());
  useEffect(() => { const onPop = () => setRoute(routeSlug()); window.addEventListener("popstate", onPop); return () => window.removeEventListener("popstate", onPop); }, []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [chaos, setChaos] = useState("all");
  const [status, setStatus] = useState("all");
  const [character, setCharacter] = useState("all");
  const [tag, setTag] = useState("all");
  const [level, setLevel] = useState(3);
  const [copies, setCopies] = useState(3);
  const [ducks] = useState(6);
  const [terminal, setTerminal] = useState(false);
  const [checklist, setChecklist] = useState(() => Object.fromEntries(checklistSeed.map((_, i) => [i, false])));
  const [logs, setLogs] = useState(initialLogs);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter(article => {
      const haystack = [article.title, article.category, article.type, article.status, ...(article.characters || []), ...(article.tags || [])].join(" ").toLowerCase();
      return (!q || haystack.includes(q))
        && (category === "all" || article.category === category)
        && (type === "all" || article.type === type)
        && (chaos === "all" || String(article.chaos) === chaos)
        && (status === "all" || article.status === status)
        && (character === "all" || article.characters?.includes(character))
        && (tag === "all" || article.tags?.includes(tag));
    });
  }, [query, category, type, chaos, status, character, tag]);

  const clearFilters = () => {
    setQuery(""); setCategory("all"); setType("all"); setChaos("all"); setStatus("all"); setCharacter("all"); setTag("all");
  };

  if (route) {
    const article = articles.find(item => slugFromPath(item.path) === route);
    if (article) return <ArticlePage article={article} onBack={() => navigate("/")} />;
    return <NotFound onBack={() => navigate("/")} />;
  }

  if (view === "console") {
    return <ContainmentConsole {...{level,setLevel,copies,setCopies,ducks,terminal,setTerminal,checklist,setChecklist,logs,setLogs}} onBack={() => setView("articles")} />;
  }

  return <div className="app library-app">
    <div className="scanlines"/>
    <header className="topbar">
      <div className="brand"><div className="bunny-mark">૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა</div><div><strong>ESTROBUNNY // WIKIHOW</strong><span>PRACTICAL GUIDES FOR IMPRACTICAL SITUATIONS</span></div></div>
      <div className="top-status"><span className="dot"/> {articles.length} ARTICLES <span className="version">CONTENT INDEX ONLINE</span></div>
    </header>
    <main>
      <section className="library-hero panel">
        <div>
          <div className="eyebrow">☣ DOCUMENTATION INDEX</div>
          <h1>ESTROBUNNY <span>WIKIHOW</span></h1>
          <p className="subtitle">PRACTICAL GUIDES FOR IMPRACTICAL SITUATIONS</p>
          <p className="lede">Browse the documentation. Filter the chaos. Pretend this was always the plan.</p>
        </div>
        <button className="console-launch" onClick={() => setView("console")}>OPEN FORM 19-C CONSOLE ↗</button>
      </section>

      <section className="filter-panel panel">
        <div className="panel-head"><div><span className="eyebrow">CONTENT DISCOVERY</span><h2>FILTER THE CHAOS</h2></div><span className="count">{filtered.length}/{articles.length}</span></div>
        <div className="search-row"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title, category, character, tag..." aria-label="Search articles"/><button className="clear-button" onClick={clearFilters}>RESET</button></div>
        <div className="filters">
          <Filter label="CATEGORY" value={category} setValue={setCategory} options={Object.keys(categoryLabels)} labels={categoryLabels}/>
          <Filter label="TYPE" value={type} setValue={setType} options={Object.keys(typeLabels)} labels={typeLabels}/>
          <Filter label="CHAOS" value={chaos} setValue={setChaos} options={Object.keys(chaosLabels)} labels={chaosLabels}/>
          <Filter label="STATUS" value={status} setValue={setStatus} options={unique("status")} labels={Object.fromEntries(unique("status").map(x => [x, x.toUpperCase()]))}/>
          <Filter label="CHARACTER" value={character} setValue={setCharacter} options={unique("characters")} labels={Object.fromEntries(unique("characters").map(x => [x, x]))}/>
          <Filter label="TAG" value={tag} setValue={setTag} options={unique("tags")} labels={Object.fromEntries(unique("tags").map(x => [x, "#"+x]))}/>
        </div>
      </section>

      <section className="article-toolbar"><span>{filtered.length === 1 ? "1 DOCUMENT" : filtered.length + " DOCUMENTS"} MATCHED</span><span>METADATA-DRIVEN // PATHS PRESERVED</span></section>
      <section className="article-grid">
        {filtered.map(article => <ArticleCard key={article.path} article={article} onOpen={() => navigate("/articles/"+slugFromPath(article.path))} />)}
      </section>
      {!filtered.length && <div className="empty-state panel"><strong>NO DOCUMENTS FOUND.</strong><span>The filters have achieved containment. This is suspicious.</span><button onClick={clearFilters}>RESTORE CHAOS</button></div>}
    </main>
    <footer><span>ESTROBUNNY WIKIHOW // CONTENT INDEX</span><span>still here 🏳️‍⚧️</span><span>STATUS: {filtered.length ? "OPERATIONAL" : "CONTAINED"}</span></footer>
  </div>;
}

function Filter({label,value,setValue,options,labels}) {
  return <label className="filter"><span>{label}</span><select value={value} onChange={e => setValue(e.target.value)}><option value="all">ALL</option>{options.map(option => <option key={option} value={option}>{labels?.[option] ?? option}</option>)}</select></label>;
}

function ArticleCard({article,onOpen}) {
  return <article className="article-card panel">
    <div className="card-top"><span className="category-badge">{categoryLabels[article.category] || article.category}</span><span className={"chaos-badge chaos-"+article.chaos}>{chaosLabels[article.chaos] || "CHAOS "+article.chaos}</span></div>
    <h2>{article.title}</h2>
    <div className="card-meta"><span>{typeLabels[article.type] || article.type}</span><span>{article.status.toUpperCase()}</span></div>
    <div className="tag-cloud">{article.tags?.slice(0,5).map(item => <span key={item}>#{item}</span>)}</div>
    <div className="card-footer"><span>{article.characters?.length ? "🐰 "+article.characters.join(" · ") : "NO CHARACTERS REGISTERED"}</span><button onClick={onOpen}>OPEN ARTICLE →</button></div>
  </article>;
}

function headingId(text, index) {
  return "section-" + index + "-" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function extractHeadings(body) {
  return body.split("\n").map((line, index) => {
    const match = line.trim().match(/^#{2,3} (.+)$/);
    return match ? { id: headingId(match[1], index), text: match[1], level: line.trim().startsWith("###") ? 3 : 2 } : null;
  }).filter(Boolean);
}

function renderArticleBody(body) {
  return body.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div className="article-spacer" key={i}/>;
    if (trimmed.startsWith("# ")) return <h2 key={i}>{trimmed.slice(2)}</h2>;
    if (trimmed.startsWith("## ")) return <h2 id={headingId(trimmed.slice(3), i)} key={i}>{trimmed.slice(3)}</h2>;
    if (trimmed.startsWith("### ")) return <h3 id={headingId(trimmed.slice(4), i)} key={i}>{trimmed.slice(4)}</h3>;
    if (trimmed.startsWith("> ")) return <blockquote key={i}>{trimmed.slice(2)}</blockquote>;
    if (trimmed.startsWith("- ")) return <li key={i}>{trimmed.slice(2)}</li>;
    if (trimmed.startsWith("`") && trimmed.endsWith("`")) return <pre key={i}>{trimmed.slice(1,-1)}</pre>;
    return <p key={i}>{trimmed}</p>;
  });
}

function ArticlePage({article,onBack}) {
  const headings = useMemo(() => extractHeadings(article.body), [article.body]);
  const [activeHeading, setActiveHeading] = useState(headings[0]?.id || "");
  const restoredScrollRef = useRef(false);
  const scrollKey = `estrobunny-wikihow-article-scroll-${article.slug}`;

  useEffect(() => {
    restoredScrollRef.current = false;
    let saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(scrollKey) || "null");
    } catch {
      saved = null;
    }
    if (!saved || typeof saved.y !== "number") {
      restoredScrollRef.current = true;
      return undefined;
    }
    const timer = window.setTimeout(() => {
      window.scrollTo({ left: saved.x || 0, top: saved.y, behavior: "instant" });
      restoredScrollRef.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [article.slug, scrollKey]);
  const restoredSectionRef = useRef(false);

  useEffect(() => {
    restoredSectionRef.current = false;
    if (!headings.length) return undefined;
    const key = `estrobunny-wikihow-article-section-${article.slug}`;
    let saved = null;
    try {
      saved = sessionStorage.getItem(key);
    } catch {
      saved = null;
    }
    if (!saved || !headings.some(item => item.id === saved)) {
      restoredSectionRef.current = true;
      return undefined;
    }
    const timer = window.setTimeout(() => {
      const element = document.getElementById(saved);
      if (element) {
        element.scrollIntoView({ behavior: "instant", block: "start" });
        setActiveHeading(saved);
      }
      restoredSectionRef.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [article.slug, headings]);

  useEffect(() => {
    if (!activeHeading || !restoredSectionRef.current) return;
    try {
      sessionStorage.setItem(`estrobunny-wikihow-article-section-${article.slug}`, activeHeading);
    } catch {
      // Storage may be unavailable; reading position still works for this visit.
    }
  }, [activeHeading, article.slug]);
  useEffect(() => {
    if (!headings.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveHeading(visible[0].target.id);
    }, { rootMargin: "-100px 0px -65% 0px", threshold: [0, 0.1, 0.5] });
    headings.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    const saveScroll = () => {
      if (!restoredScrollRef.current) return;
      try {
        sessionStorage.setItem(scrollKey, JSON.stringify({
          x: window.scrollX,
          y: window.scrollY
        }));
      } catch {
        // Storage may be unavailable.
      }
    };
    const onPageHide = () => saveScroll();
    window.addEventListener("scroll", saveScroll, { passive: true });
    window.addEventListener("pagehide", onPageHide);
    return () => {
      saveScroll();
      window.removeEventListener("scroll", saveScroll);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [scrollKey]);
  const index = articles.findIndex(item => item.path === article.path);
  const previous = index > 0 ? articles[index - 1] : null;
  const next = index < articles.length - 1 ? articles[index + 1] : null;
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const related = articles.filter(item => item.path !== article.path && (item.category === article.category || item.type === article.type)).slice(0,4);
  return <div className="app wiki-page">
    <div className="scanlines"/>
    <header className="topbar"><div className="brand"><div className="bunny-mark">૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა</div><div><strong>ESTROBUNNY // WIKIHOW</strong><span>PRACTICAL GUIDES FOR IMPRACTICAL SITUATIONS</span></div></div><div className="top-status"><span className="dot"/> ARTICLE ONLINE <span className="version">{article.status.toUpperCase()}</span></div></header>
    <main>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <button onClick={onBack}>ESTROBUNNY WIKIHOW</button><span>/</span>
        <button onClick={onBack}>{categoryLabels[article.category] || article.category}</button><span>/</span>
        <strong>{article.title}</strong>
      </nav>
      <div className="wiki-nav"><button className="back-button" onClick={onBack}>← ALL ARTICLES</button><button className="copy-link" onClick={copyLink}>{copied ? "✓ LINK COPIED" : "COPY LINK ↗"}</button></div>
      <article className="wiki-layout">
        <aside className="wiki-sidebar panel"><TableOfContents headings={headings} activeHeading={activeHeading} /><div className="sidebar-divider"/><div className="eyebrow">DOCUMENT CLASSIFICATION</div><div className="wiki-class"><b>{categoryLabels[article.category]}</b><span>{typeLabels[article.type]}</span><span>{chaosLabels[article.chaos]}</span><span>STATUS: {article.status.toUpperCase()}</span></div><div className="eyebrow">CHARACTERS</div><div className="sidebar-tags">{(article.characters || []).map(x => <span key={x}>🐰 {x}</span>)}</div><div className="eyebrow">TAGS</div><div className="sidebar-tags">{(article.tags || []).map(x => <span key={x}>#{x}</span>)}</div></aside>
        <section className="wiki-article panel"><div className="eyebrow">WIKIHOW ARTICLE // {slugFromPath(article.path)}</div><h1>{article.title}</h1><div className="wiki-meta"><span>{categoryLabels[article.category]}</span><span>{typeLabels[article.type]}</span><span>CHAOS {article.chaos}</span></div><div className="wiki-rule"/><div className="wiki-body">{renderArticleBody(article.body)}</div><div className="wiki-end"><strong>YOU HAVE REACHED THE END OF THE DOCUMENT.</strong><span>The documentation remains operational.</span><button className="console-launch" onClick={onBack}>← RETURN TO ARTICLE INDEX</button></div></section>
      </article>
      <nav className="article-pagination" aria-label="Article navigation">
        <ArticleNavButton article={previous} direction="previous" />
        <span>DOCUMENT {index + 1} / {articles.length}</span>
        <ArticleNavButton article={next} direction="next" />
      </nav>
      <section className="related-section"><div className="eyebrow">RELATED DOCUMENTATION</div><h2>YOU MAY ALSO NEED THESE.</h2><div className="related-grid">{related.map(item => <button key={item.path} className="related-card panel" onClick={() => navigate("/articles/"+slugFromPath(item.path))}><span>{typeLabels[item.type]}</span><b>{item.title}</b><small>{categoryLabels[item.category]} · CHAOS {item.chaos}</small></button>)}</div></section>
    </main>
    <footer><span>ESTROBUNNY WIKIHOW // ARTICLE</span><span>still here 🏳️‍⚧️</span><span>STATUS: {article.status.toUpperCase()}</span></footer>
  </div>;
}

function TableOfContents({headings,activeHeading}) {
  const tocStorageKey = "estrobunny-wikihow-mobile-toc-open";
  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(tocStorageKey) === "true";
    } catch {
      return false;
    }
  });
  const active = headings.find(item => item.id === activeHeading) || headings[0];
  useEffect(() => {
    try {
      sessionStorage.setItem(tocStorageKey, String(open));
    } catch {
      // Storage may be unavailable; local component state still works.
    }
  }, [open]);
  const jumpTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  if (!headings.length) return <div><div className="eyebrow">CONTENTS</div><p className="toc-empty">NO HEADINGS REGISTERED.</p></div>;
  return <div className={"toc "+(open ? "toc-open" : "")}><button className="toc-mobile-header" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="article-toc-list"><span><small>TABLE OF CONTENTS</small><strong>{active?.text || "START OF ARTICLE"}</strong></span><b>{open ? "−" : "+"}</b></button><div className="eyebrow toc-desktop-label">TABLE OF CONTENTS</div><nav id="article-toc-list" aria-label="Table of contents">{headings.map(item => <a key={item.id} className={activeHeading === item.id ? "active" : ""} style={{paddingLeft: item.level === 3 ? "18px" : "8px"}} href={"#"+item.id} onClick={event => { event.preventDefault(); jumpTo(item.id); }}>{item.text}</a>)}</nav><div className="eyebrow toc-meta">LIVE SECTION TRACKING</div></div>;
}
function ArticleNavButton({article,direction}) {
  if (!article) return <span className="article-nav-placeholder"/>;
  return <button className={"article-nav "+direction} onClick={() => navigate("/articles/"+slugFromPath(article.path))}>
    <small>{direction === "previous" ? "← PREVIOUS ARTICLE" : "NEXT ARTICLE →"}</small>
    <strong>{article.title}</strong>
  </button>;
}

function NotFound({onBack}) {
  return <div className="app library-app"><main><div className="empty-state panel"><strong>404 // DOCUMENT NOT FOUND</strong><span>This article has escaped containment.</span><button onClick={onBack}>RETURN TO INDEX</button></div></main></div>;
}
function ContainmentConsole({level,setLevel,copies,setCopies,ducks,terminal,setTerminal,checklist,setChecklist,logs,setLogs,onBack}) {
  const current = levels[level];
  const completed = Object.values(checklist).filter(Boolean).length;
  const containment = Math.round(completed / checklistSeed.length * 100);
  const state = level >= 5 ? "CATASTROPHIC" : level >= 3 ? "ACTIVE" : "STABLE";
  const progress = [8,30,55,76,92,100][level];
  const addLog = (source,message) => setLogs(items => [...items,[new Date().toLocaleTimeString("en-ZA",{hour12:false}),source,message]].slice(-10));
  const escalate = (next = Math.min(5,level+1)) => { setLevel(next); setCopies(n => n + (next >= 3 ? 1 : 0)); addLog("ALERT", "Alert level raised to "+next+": "+levels[next].name+"."); };
  const toggle = i => setChecklist(s => ({...s,[i]:!s[i]}));
  const contain = () => { setLevel(2); setCopies(n => Math.max(3,n-1)); addLog("CONTAINMENT","Containment attempt initiated. Paperwork freeze active."); };
  const openTerminal = () => { setTerminal(true); addLog("ESTROBUNNY","Terminal opened. Documentation Team notified."); };

  return <div className={"app level-"+level}><div className="scanlines"/>
    <header className="topbar"><div className="brand"><div className="bunny-mark">૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა</div><div><strong>ESTROBUNNY // WIKIHOW</strong><span>ADMINISTRATIVE ANOMALY CONTAINMENT NETWORK</span></div></div><div className="top-status"><span className="dot"/> SYSTEM ONLINE <span className="version">EB-IR-19C / v0.1</span></div></header>
    <main>
      <button className="back-button" onClick={onBack}>← BACK TO ARTICLE INDEX</button>
      <section className="hero panel"><div className="hero-copy"><div className="eyebrow">☣ DOCUMENT CONTAINMENT PROTOCOL</div><h1>FORM <span>19-C</span></h1><p className="subtitle">SELF-REPLICATING BUREAUCRATIC ANOMALY</p><p className="lede">A dead-serious control console for paperwork that has stopped respecting the laws of paperwork.</p><div className="hero-actions"><button className="primary" onClick={() => escalate()}>RAISE ALERT LEVEL</button><button className="secondary" onClick={contain}>ATTEMPT CONTAINMENT</button></div></div><div className="hero-core"><div className="core-ring"><span>19-C</span></div><div className="core-label">DOCUMENT<br/>ISOLATION</div></div></section>
      <section className="telemetry-grid"><Metric label="ALERT LEVEL" value={level} note={current.name} color={current.color}/><Metric label="KNOWN COPIES" value={copies} note="↑ replication detected"/><Metric label="CONTAINMENT" value={containment+"%"} note={completed+"/"+checklistSeed.length+" controls active"}/><Metric label="DUCKS RECOVERED" value={<>{ducks}<em>/7</em></>} note={ducks===7?"All accounted for":"One duck remains missing"}/></section>
      <section className="dashboard-grid"><article className="panel alert-panel"><PanelHead eyebrow="CURRENT CONDITION" title="RED-ALERT MATRIX" badge={<span className={"state-badge "+current.color}>{state}</span>}/><div className="level-list">{levels.map(item => <button key={item.id} className={"level-row "+(item.id===level?"selected":"")} onClick={() => setLevel(item.id)}><span className={"level-index "+item.color}>{item.id}</span><span className="level-info"><b>{item.name}</b><small>{item.desc}</small></span><span className="chevron">›</span></button>)}</div></article><article className="panel checklist-panel"><PanelHead eyebrow="RESPONSE PROTOCOL" title="CONTAINMENT CHECKLIST" badge={<span className="count">{completed}/{checklistSeed.length}</span>}/><div className="progress"><span style={{width:progress+"%"}}/></div><div className="checks">{checklistSeed.map((item,i) => <label className={checklist[i]?"checked":""} key={item}><input type="checkbox" checked={!!checklist[i]} onChange={() => toggle(i)}/><span className="fake-check">✓</span><span>{item}</span></label>)}</div></article></section>
      <section className="lower-grid"><article className="panel log-panel"><PanelHead eyebrow="LIVE TELEMETRY" title="INCIDENT LOG" badge={<span className="live"><i/> LIVE</span>}/><div className="log-window">{logs.slice(-8).map(([time,source,msg],i) => <div className="log-line" key={time+i}><time>{time}</time><b>{source}</b><span>{msg}</span></div>)}</div></article><article className="panel rules-panel"><PanelHead eyebrow="HANDLING DIRECTIVE" title="DO NOT" badge={<span className="danger">NOPE</span>}/><ul><li>Photocopy Form 19-C without authorization.</li><li>Create <code>Form 19-D</code>.</li><li>Combine contradictory instructions “to save time.”</li><li>Ask Greg to interpret the paperwork.</li><li>Open another terminal to automate the process.</li></ul><div className="directive">DO NOT ATTEMPT TO OUT-PAPERWORK THE PAPERWORK.</div></article></section>
      <section className="incident-strip panel"><div><span className="eyebrow">EMERGENCY ESCALATION</span><h2>THE PAPERWORK IS NOT MALICIOUS.</h2><p>It is simply following the instructions.</p></div><button className="danger-button" onClick={() => escalate(5)}>DECLARE LEVEL 5</button></section>
      <section className="terminal panel"><div className="terminal-head"><div className="traffic"><i/><i/><i/></div><span>estrobunny@containment:~</span><button onClick={openTerminal}>{terminal?"TERMINAL ACTIVE":"OPEN TERMINAL"}</button></div><pre>{terminal ? "$ ./contain-form-19-c\n> Loading containment protocol...\n> Original document: FOUND\n> Copies: "+copies+"\n> Alert level: "+level+"\n> Containment: "+containment+"%\n> Greg: NOT AUTHORIZED\n> Photocopier: SECURED\n> EstroBunny: \"I have an idea.\"\n\nSYSTEM:\nPlease step away from the keyboard.\n\nEstroBunny:\nbut what if—\n\nSYSTEM:\nNO.\n\n$ _" : "$ ./contain-form-19-c\n> containment console ready\n> type \"open-terminal\" if you absolutely must make this worse\n\n$ _"}</pre></section>
    </main>
    <footer><span>ESTROBUNNY WIKIHOW // EB-IR-19C</span><span>still here 🏳️‍⚧️</span><span>STATUS: {state}</span></footer>
  </div>;
}

function Metric({label,value,note,color}) { return <article className="metric panel"><span>{label}</span><strong className={color}>{value}</strong><small>{note}</small></article>; }
function PanelHead({eyebrow,title,badge}) { return <div className="panel-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{badge}</div>; }

const levels = [
  {id:0,name:"NORMAL",color:"cyan",desc:"Form 19-C is behaving normally."},{id:1,name:"UNUSUAL PAPERWORK",color:"yellow",desc:"A new form has appeared unexpectedly."},{id:2,name:"CONTRADICTORY",color:"orange",desc:"Two documents now disagree."},{id:3,name:"SELF-REPLICATION",color:"red",desc:"Additional copies are appearing."},{id:4,name:"BUREAUCRATIC RECURSION",color:"red",desc:"The forms require each other."},{id:5,name:"ADMINISTRATIVE CATASTROPHE",color:"magenta",desc:"A form explaining a form has appeared."}
];
const checklistSeed = ["Original Form 19-C identified","Current version preserved","Contradictory instructions recorded","Photocopier secured","Printer secured","Unnecessary stationery removed","Authoritative clarification requested","EstroBunny removed from the printer area","Greg kept outside the evidence register","Rubber ducks accounted for"];
const initialLogs = [["21:14:02","SYSTEM","Form 19-C containment console initialized."],["21:14:09","SCAN","Original document located. No immediate replication detected."],["21:14:31","WARN","Form 19-C(a) references Form 19-C(b)."],["21:14:32","WARN","Form 19-C(b) references Form 19-C(a)."],["21:14:47","ESTROBUNNY","I have an idea."],["21:14:48","SYSTEM","ESCALATION RECOMMENDED."]];
