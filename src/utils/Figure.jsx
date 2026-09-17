/*
 * A figure with a caption and an explicit source credit.
 *
 * Two problems this exists to solve:
 *
 *  - Copyright. Diagrams borrowed from other people's posts were being shown
 *    with no visible credit and no link to where they came from. Naming the
 *    source next to the image is both the decent thing and the thing that
 *    makes a fair-dealing / fair-use argument tenable.
 *  - Accessibility. The images it replaces were <img onClick> — not
 *    focusable, not operable from a keyboard, and silent to screen readers
 *    about the fact that clicking navigates. Here the full-size view is a
 *    real link, so it is keyboard-reachable and announces itself.
 *
 * `src` may be a hotlinked third-party URL, but prefer a local copy: a
 * hotlink can break without warning and serves the image off someone else's
 * bandwidth. See `credit` for who to name.
 */
const Figure = ({
  src,
  alt,
  caption,
  credit,
  creditHref,
  width = "100%",
  background,
}) => (
  <figure
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
      margin: "1.5rem 0",
    }}
  >
    <img
      src={src}
      alt={alt}
      width={width}
      style={background ? { backgroundColor: background } : undefined}
      loading="lazy"
    />
    <figcaption style={{ fontSize: "0.8rem", textAlign: "center" }}>
      {caption && (
        <span>
          <i>{caption}</i>
        </span>
      )}
      {credit && (
        <span style={{ opacity: 0.8 }}>
          {caption ? " · " : ""}
          Source:{" "}
          {creditHref ? (
            <a href={creditHref} target="_blank" rel="noreferrer noopener">
              {credit}
            </a>
          ) : (
            credit
          )}
        </span>
      )}
      {" · "}
      <a href={src} target="_blank" rel="noreferrer noopener">
        View full size
      </a>
    </figcaption>
  </figure>
);

export default Figure;
