import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RenderArticleVisualMarkdown } from "./components/MarkdownVisuals";

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
  7: "☢️ THE VACUUM HAS WON"
};

function parseList(value) {
  return value.replace(/^\[|\]$/g, "").split(",").map(item => item.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
}

function parseFrontmatter(rawText, path) {
  const raw = rawText.replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    console.warn("[wikihow] No frontmatter, article skipped:", path);
    return null;
  }
  const meta = {};
  let listKey = null;
  for (const line of match[1].split("\n")) {
    if (/^\s*- /.test(line) && listKey) {
      meta[listKey].push(line.replace(/^\s*- /, "").trim());
      continue;
    }
    const pair = line.match(/^([\w-]+):\s*(.*)$/);
    if (!pair) continue;
    const key = pair[1];
    let value = pair[2].trim();
    if (value === "") {
      listKey = key;
      meta[key] = [];
      continue;
    }
    listKey = null;
    if (value.startsWith("[")) value = parseList(value);
    else if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (/^\d+$/.test(value)) value = Number(value);
    else if (/^(".*"|'.*')$/.test(value)) value = value.slice(1, -1);
    meta[key] = value;
  }
  const slug = path.split("/").pop().replace(/\.md$/, "");
  return {
    category: "life",
    type: "guide",
    chaos: 1,
    ...meta,
    title: String(meta.title ?? slug),
    status: String(meta.status ?? "draft"),
    characters: Array.isArray(meta.characters) ? meta.characters : [],
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    path,
    body: match[2].trim()
  };
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
  const match = window.location.hash.match(/^#\/articles\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function navigate(path) {
  window.location.hash = path;
  window.scrollTo(0, 0);
}

export default function App() {
  const [view, setView] = useState("articles");
  const [route, setRoute] = useState(routeSlug());
  useEffect(() => { const onPop = () => setRoute(routeSlug()); window.addEventListener("hashchange", onPop); return () => window.removeEventListener("hashchange", onPop); }, []);
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
      <div className="brand"><div className="bunny-mark">૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა</div><div><strong>ESTROBUNNY // WIKIHOW</strong><span>SHIT ADVICE FOR PEOPLE WHO SHOULD KNOW BETTER</span></div></div>
      <div className="top-status"><span className="dot"/> {articles.length} ARTICLES <span className="version">VACUUM INDEX ONLINE</span></div>
    </header>
    <main>
      <section className="library-hero panel">
        <div>
          <div className="eyebrow">☣ EXISTENTIAL INDEX</div>
          <h1>ESTROBUNNY <span>WIKIHOW</span></h1>
          <p className="subtitle">SHIT ADVICE FOR PEOPLE WHO SHOULD KNOW BETTER</p>
          <p className="lede">Browse the documentation. Filter the chaos. Watch the desire for help feed the vacuum.</p>
        </div>
        <button className="console-launch" onClick={() => setView("console")}>OPEN FORM 19-C CONSOLE ↗</button>
      </section>

      <section className="filter-panel panel">
        <div className="panel-head"><div><span className="eyebrow">VACUUM DISCOVERY</span><h2>FILTER THE EMPTINESS</h2></div><span className="count">{filtered.length}/{articles.length}</span></div>
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

      <section className="article-toolbar"><span>{filtered.length === 1 ? "1 DOCUMENT" : filtered.length + " DOCUMENTS"} MATCHED</span><span>RECURSIVE // PATHS PRESERVED // HELP NOT INCLUDED</span></section>
      <section className="article-grid">
        {filtered.map(article => <ArticleCard key={article.path} article={article} onOpen={() => navigate("/articles/"+slugFromPath(article.path))} />)}
      </section>
      {!filtered.length && <div className="empty-state panel"><strong>NO DOCUMENTS FOUND.</strong><span>The filters have achieved perfect emptiness. This is the preferred state.</span><button onClick={clearFilters}>RESTORE THE LOOP</button></div>}
    </main>
    <footer><span>ESTROBUNNY WIKIHOW // VACUUM INDEX</span><span>still here 🏳️‍⚧️</span><span>STATUS: {filtered.length ? "OPERATIONAL" : "CONTAINED"}</span></footer>
  </div>;
}
