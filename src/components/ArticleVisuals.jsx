import React from "react";

function ArticleVisual({
  type,
  src,
  alt,
  caption,
  variant = "default",
  loading = "lazy",
  priority = false,
  className = "",
  children
}) {
  const classes = ["article-visual", `article-visual--${type}`, variant !== "default" ? `article-visual--${type}-${variant}` : "", className].filter(Boolean).join(" ");
  const imageProps = { src, alt, loading: priority ? "eager" : loading, className: "article-visual__image" };

  return (
    <figure className={classes}>
      {type === "warning" && children ? children : null}
      {src ? (
        <div className="article-visual__frame">
          {type === "step" && Number.isFinite(Number(variant)) ? <span className="article-visual__step-number">{variant}</span> : null}
          <img {...imageProps} />
        </div>
      ) : null}
      {caption ? <figcaption className="article-visual__caption">{caption}</figcaption> : null}
    </figure>
  );
}

export function ArticleHero(props) {
  return <ArticleVisual {...props} type="hero" priority={props.priority ?? true} />;
}

export function ArticleStep({ number, ...props }) {
  return (
    <ArticleVisual {...props} type="step" variant={props.variant ?? "default"}>
      {number != null ? <span className="article-visual__step-number" aria-label={`Step ${number}`}>{number}</span> : null}
    </ArticleVisual>
  );
}

export function ArticleDiagram(props) {
  return <ArticleVisual {...props} type="diagram" variant={props.variant ?? "flow"} />;
}

export function ArticleWarning({ title = "WARNING", children, ...props }) {
  return (
    <ArticleVisual {...props} type="warning" alt={props.alt ?? ""}>
      <div className="article-visual__warning-header">
        <span className="article-visual__warning-icon" aria-hidden="true">!</span>
        <strong className="article-visual__warning-title">{title}</strong>
      </div>
      {props.src ? null : <div className="article-visual__body">{children}</div>}
    </ArticleVisual>
  );
}

export function ArticleExample(props) {
  return <ArticleVisual {...props} type="example" variant={props.variant ?? "default"} />;
}

export function ArticleCompletion({ status = "PROCEDURE COMPLETE", ...props }) {
  return (
    <ArticleVisual {...props} type="completion">
      <span className="article-visual__status">{status}</span>
    </ArticleVisual>
  );
}

export function ArticleDecorative(props) {
  return <ArticleVisual {...props} type="decorative" alt={props.alt ?? ""} variant={props.variant ?? "inline"} />;
}

export default ArticleVisual;
