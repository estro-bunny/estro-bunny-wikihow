import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleHero, ArticleStep, ArticleDiagram, ArticleWarning, ArticleExample, ArticleCompletion, ArticleDecorative } from "./ArticleVisuals";
import ChaosInteraction from "./ChaosInteraction";

const openingPattern = /^:::(hero|step|diagram|warning|example|completion|decorative|chaos)(?:\s+(.*))?\s*$/;

function parseArguments(raw = "") {
  const value = raw.trim();
  if (!value) return [];
  const matches = value.match(/"[^"]*"|'[^']*'|\S+/g) || [];
  return matches.map(item => item.replace(/^["']|["']$/g, ""));
}

function findImage(markdown) {
  const lines = markdown.split("\n");
  const imagePattern = /^\s*!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']*)["'])?\)\s*$/;
  const index = lines.findIndex(line => imagePattern.test(line));
  if (index < 0) return { image: null, body: markdown.trim() };
  const match = lines[index].match(imagePattern);
  const image = { alt: match[1], src: match[2], title: match[3] || "" };
  lines.splice(index, 1);
  return { image, body: lines.join("\n").trim() };
}

export function parseArticleVisuals(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let normal = [];
  let normalStart = 0;
  let index = 0;
  let fenceChar = null;
  let fenceLength = 0;
  const flushNormal = endIndex => {
    if (!normal.length) return;
    blocks.push({ type: "markdown", body: normal.join("\n"), startLine: normalStart });
    normal = [];
    normalStart = endIndex;
  };
  while (index < lines.length) {
    const fence = lines[index].match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      const marker = fence[1][0];
      const length = fence[1].length;
      if (fenceChar === null) {
        fenceChar = marker;
        fenceLength = length;
      } else if (marker === fenceChar && length >= fenceLength) {
        fenceChar = null;
        fenceLength = 0;
      }
      if (!normal.length) normalStart = index;
      normal.push(lines[index]);
      index += 1;
      continue;
    }
    if (fenceChar !== null) {
      if (!normal.length) normalStart = index;
      normal.push(lines[index]);
      index += 1;
      continue;
    }
    const opening = lines[index].trim().match(openingPattern);
    if (!opening) {
      if (!normal.length) normalStart = index;
      normal.push(lines[index]);
      index += 1;
      continue;
    }
    let closeIndex = index + 1;
    while (closeIndex < lines.length && lines[closeIndex].trim() !== ":::") closeIndex += 1;
    if (closeIndex >= lines.length) {
      if (!normal.length) normalStart = index;
      normal.push(lines[index]);
      index += 1;
      continue;
    }
    flushNormal(index);
    blocks.push({ type: opening[1], args: parseArguments(opening[2] || ""), body: lines.slice(index + 1, closeIndex).join("\n").trim(), startLine: index });
    index = closeIndex + 1;
    normalStart = index;
  }
  flushNormal(lines.length);
  return blocks;
}

function renderCaption(markdown, key) {
  if (!markdown) return null;
  return <div className="article-visual__caption-markdown" key={key}><ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown></div>;
}

export function ArticleVisualBlock({ block, renderMarkdown }) {
  const { image, body } = findImage(block.body);
  const args = block.args || [];
  const common = { src: image?.src, alt: image?.alt ?? "" };
  if (block.type === "warning") {
    return <ArticleWarning {...common} title={args.join(" ") || "WARNING"}>{body ? renderMarkdown(body, block.startLine + 1) : null}</ArticleWarning>;
  }
  const caption = renderCaption(body, "visual-caption-" + block.startLine);
  if (block.type === "hero") return <ArticleHero {...common} variant={args[0] || "default"} caption={caption} />;
  if (block.type === "step") {
    const number = /^\d+$/.test(args[0] || "") ? Number(args[0]) : undefined;
    return <ArticleStep {...common} number={number} caption={caption} />;
  }
  if (block.type === "diagram") return <ArticleDiagram {...common} variant={args[0] || "flow"} caption={caption} />;
  if (block.type === "example") return <ArticleExample {...common} variant={args[0] || "default"} caption={caption} />;
  if (block.type === "completion") return <ArticleCompletion {...common} status={args.join(" ") || "PROCEDURE COMPLETE"} caption={caption} />;
  if (block.type === "decorative") return <ArticleDecorative {...common} variant={args[0] || "inline"} />;
  if (block.type === "chaos") return <ChaosInteraction />;
  return null;
}

export function RenderArticleVisualMarkdown({ markdown, renderMarkdown }) {
  const blocks = parseArticleVisuals(markdown);
  return <>{blocks.map((block, index) => block.type === "markdown"
    ? <React.Fragment key={"markdown-" + block.startLine + "-" + index}>{renderMarkdown(block.body, block.startLine)}</React.Fragment>
    : <ArticleVisualBlock key={"visual-" + block.startLine + "-" + index} block={block} renderMarkdown={renderMarkdown} />)}</>;
}
