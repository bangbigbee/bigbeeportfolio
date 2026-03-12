import React, { useState, useEffect } from "react";
import { ProductCard } from "../types";
import { getOptimizedUrl } from "../App";
import SmartImage from "./SmartImage";

const MixedMasonry: React.FC<{ items: ProductCard[]; onImageClick?: any }> = ({
  items,
  onImageClick,
}) => {
  const [cols, setCols] = useState(1);

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1024) setCols(3);
      else if (window.innerWidth >= 768) setCols(2);
      else setCols(1);
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  if (!items || items.length === 0) return null;

  // Split items into columns
  const columns: ProductCard[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, idx) => {
    columns[idx % cols].push(item);
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex gap-8 items-start">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex-1 flex flex-col gap-8">
          {col.map((item, idx) => (
            <div
              key={item.id || idx}
              className="block w-full mt-0"
              onClick={() => onImageClick && onImageClick(item)}
            >
              <div className="relative overflow-hidden rounded-none group shadow-lg bg-white cursor-pointer">
                <SmartImage
                  src={getOptimizedUrl(item.imageUrl, "thumb")}
                  alt={item.title}
                  aspectRatio="auto"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="p-8">
                  <span className="text-[#86868b] text-xs font-black uppercase tracking-widest">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-black text-[#1d1d1f] mt-1 uppercase tracking-tighter">
                    {item.title}
                  </h3>
                  <p className="text-[#86868b] mt-2 font-medium italic">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MixedMasonry;
