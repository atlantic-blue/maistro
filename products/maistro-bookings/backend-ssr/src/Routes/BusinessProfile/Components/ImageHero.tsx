import React from 'react';
import ImagePlaceHolder from './ImagePlaceHolder';

const Image = ({
  src: src,
  name,
  className,
}: {
  src?: string;
  name?: string;
  className?: string;
}) => {
  // graceful placeholder
  if (!src) {
    return <ImagePlaceHolder name={name} />;
  }

  return (
    <img
      src={src}
      alt={name || 'Galería principal'}
      className={className ? className : 'w-full  h-72 object-cover rounded-xl'}
    />
  );
};

export default Image;
