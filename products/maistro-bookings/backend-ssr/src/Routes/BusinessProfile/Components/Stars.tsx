import React from "react";
import { Star } from "lucide-react";

const Stars = ({ rating }: { rating?: number }) => {
  if (typeof rating !== "number") return null;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-[#FF3366] text-[#FF3366]" : "text-gray-300"}`}
        />
      ))}
      <span className="font-semibold ml-2 text-gray-900">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default Stars;
