import React, { useState } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => setLoaded(true);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = `${process.env.PUBLIC_URL}/images/default-character.webp`;
  };

  return (
    <div className="lazy-image-wrapper">
      {placeholderSrc && (
        <img
          src={placeholderSrc}
          alt="placeholder"
          className="lazy-placeholder"
        />
      )}
      <img
        loading="lazy"
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`lazy-image ${loaded ? "loaded" : ""} ${props.className || ""}`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
