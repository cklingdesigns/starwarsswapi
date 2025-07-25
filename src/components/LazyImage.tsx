import React, { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
}

const LazyImage: React.FC<Props> = ({ src, alt, className = "", width }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      width={width}
      className={`fade-in-image ${loaded ? "loaded" : ""} ${className}`}
      onLoad={() => setLoaded(true)}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = `${process.env.PUBLIC_URL}/images/default-character.jpg`;
      }}
    />
  );
};

export default LazyImage;