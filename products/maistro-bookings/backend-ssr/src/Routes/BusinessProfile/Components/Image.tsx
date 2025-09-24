import React from "react";
import ImagePlaceHolder from "./ImagePlaceHolder";
import { MaistroImage } from "../../../types/BusinessProfile";

const toAbsoluteUrl = (url?: string | null) =>
  !url ? "" : /^https?:\/\//i.test(url) ? url : `https://${url}`;

const buildSrcSet = (image: MaistroImage) => `
  ${toAbsoluteUrl(image.Urls.Low)} 480w,
  ${toAbsoluteUrl(image.Urls.Medium)} 1024w,
  ${toAbsoluteUrl(image.Urls.High)} 2048w,
  ${toAbsoluteUrl(image.Urls.Optimized)} 2560w
`;

const sizes = `
  (max-width: 640px) 480px,
  (max-width: 1024px) 1024px,
  (max-width: 1440px) 2048px,
  2560px
`;

const Image = ({
  variants,
  name,
  className,
  alt,
}: {
  variants?: MaistroImage;
  name?: string;
  className?: string;
  alt?: string;
}) => {
  // graceful placeholder
  if (!variants) {
    return <ImagePlaceHolder name={name} />;
  }

  return (
    <img
      src={variants.Urls.Medium}
      alt={alt || name || ""}
      className={className ?? "w-full h-72 object-cover rounded-xl"}
      loading="lazy"
      decoding="async"
      srcSet={buildSrcSet(variants)}
      sizes={sizes}
    />
  );
};

export default Image;
