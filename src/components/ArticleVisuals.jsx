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
  number,
  title,
  status,
  children
}) {
  const classes = ["article-visual", `article-visual--${type}`, variant !== "default" ? `article-visual--${type}-${variant}` : "", className].filter(Boolean).join(" ");
  const imageProps = { src, alt, loading: priority ? "eager" : loading, className: "article-visual__image" };

  return (
    <figure className={classes}>
      {type === "warning" ? (
        <div className="article-visual__warning-header">
          <span className="article-visual__warning-icon" aria-hidden="true">!</span>
          <strong className="article-visual__warning-title">{title || "WARNING"}</strong>
        </div>
      ) : null}
      {type === "completion" && status ? <span className="article-visual__status">{status}</span> : null}
      {src ? (
        <div className="article-visual__frame">
          {type === "step" && number != null ? <span className="article-visual__step-number" aria-label={`Step ${number}`}>{number}</span> : null}
          <img {...imageProps} />
        </div>
      ) : null}
      {children ? <div className="article-visual__body">{children}</div> : null}
      {caption ? <figcaption className="article-visual__caption">{caption}</figcaption> : null}
    </figure>
  );
}

export function ArticleHero({ priority = true, ...props }) {
  return <ArticleVisual {...props} type="hero" priority={priority} />;
}

export function ArticleStep({ number, ...props }) {
  return <ArticleVisual {...props} type="step" number={number} variant={props.variant ?? "default"} />;
}

export function ArticleDiagram(props) {
  return <ArticleVisual {...props} type="diagram" variant={props.variant ?? "flow"} />;
}

export function ArticleWarning({ title = "WARNING", children, ...props }) {
  return <ArticleVisual {...props} type="warning" title={title} alt={props.alt ?? ""}>{children}</ArticleVisual>;
}

export function ArticleExample(props) {
  return <ArticleVisual {...props} type="example" variant={props.variant ?? "default"} />;
}

export function ArticleCompletion({ status = "PROCEDURE COMPLETE", ...props }) {
  return <ArticleVisual {...props} type="completion" status={status} />;
}

export function ArticleDecorative(props) {
  return <ArticleVisual {...props} type="decorative" alt={props.alt ?? ""} variant={props.variant ?? "inline"} />;
}

export default ArticleVisual;
