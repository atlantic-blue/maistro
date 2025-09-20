import React from 'react';
import { initials } from '../../../utils/initials';

const ImagePlaceHolder = ({ name }: { name?: string }) => {
  return (
    <div className="w-full h-72 lg:h-[500px] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-white shadow flex items-center justify-center">
        <span className="text-2xl lg:text-3xl font-bold text-gray-500">{initials(name)}</span>
      </div>
    </div>
  );
};

export default ImagePlaceHolder;
