import { useEffect } from "react";

/*
 * Tenor (a Google service) GIF embed.
 *
 * Two things this used to get wrong, both fixed here:
 *
 *  - The whole block was a <div onClick> that opened a new tab. A div is not
 *    focusable and does not respond to Enter/Space, so a keyboard or screen
 *    reader user could not reach it at all, and nothing announced that
 *    clicking would navigate away. The fallback <a> Tenor's own markup
 *    provides is now the only thing that navigates — a real link, keyboard
 *    operable for free.
 *  - The loader appended a fresh <script> on every mount and removed it on
 *    unmount, so a post with several embeds fetched the same script several
 *    times and could tear it out from under a sibling embed. It is now
 *    loaded once per page and left alone.
 *
 * Note: this embed is third-party content served by Google and may set its
 * own cookies once loaded. That is disclosed in /cookies.
 */

const TENOR_SCRIPT = "https://tenor.com/embed.js";

function ensureTenorScript() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[src="${TENOR_SCRIPT}"]`)) return;
  const script = document.createElement("script");
  script.src = TENOR_SCRIPT;
  script.async = true;
  document.body.appendChild(script);
}

const TenorEmbed = ({
  postId,
  aspectRatio = "1.31148",
  width = "50%",
  description = "Animated GIF",
}) => {
  useEffect(() => {
    ensureTenorScript();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "start" }}>
      <div
        className="tenor-gif-embed"
        data-postid={postId}
        data-share-method="host"
        data-aspect-ratio={aspectRatio}
        data-width={width}
      >
        {/* Tenor replaces this anchor with the player once its script runs.
            Until then — and whenever the script is blocked — it stays a
            working, keyboard-reachable link that says where it goes. */}
        <a
          href={`https://tenor.com/view/${postId}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {description} — view on Tenor (opens in a new tab)
        </a>
      </div>
    </div>
  );
};

export default TenorEmbed;
