import { useEffect } from "react";

const TenorEmbed = ({ postId, aspectRatio = "1.31148", width = "50%" }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tenor.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [postId]);

  return (
    <div
      style={{ display: "flex", justifyContent: "start" }}
      onClick={() => {
        window.open(`https://tenor.com/view/${postId}`, "_blank");
      }}
    >
      <div
        className="tenor-gif-embed"
        data-postid={postId}
        data-share-method="host"
        data-aspect-ratio={aspectRatio}
        data-width={width}
      >
        <a href={`https://tenor.com/view/${postId}`}>View GIF</a>
      </div>
    </div>
  );
};

export default TenorEmbed;
