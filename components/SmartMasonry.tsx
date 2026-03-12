import React, { memo } from "react";
import { ProductCard } from "../types";
import { getOptimizedUrl } from "../App";
import SmartImage from "./SmartImage";

interface SmartMasonryProps {
  items: ProductCard[];
  onImageClick: (img: ProductCard) => void;
}

const SmartMasonry: React.FC<SmartMasonryProps> = ({ items, onImageClick }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full columns-2 md:columns-4 lg:columns-5 gap-2 md:gap-4">
      {items.map((item, idx) => (
        <BentoItem
          key={item.id || idx}
          item={item}
          index={idx}
          onClick={() => onImageClick(item)}
        />
      ))}
    </div>
  );
};

const BentoItem = memo(
  ({
    item,
    index,
    onClick,
  }: {
    item: ProductCard;
    index: number;
    onClick: () => void;
  }) => {
    const isVideo = item.resourceType === "video" || !!item.youtubeId;

    return (
      <article
        className="relative rounded-xl overflow-hidden bg-gray-50 group inline-block w-full transition-all duration-500 cursor-pointer break-inside-avoid mb-2 md:mb-4 min-h-[100px] transform-gpu"
        style={{ 
          contentVisibility: 'auto',
          containIntrinsicSize: '0 300px'
        }}
        onClick={onClick}
      >
        <SmartImage
          src={getOptimizedUrl(item.imageUrl, "thumb")}
          alt={item.title}
          aspectRatio="auto"
          containerClassName="w-full h-auto"
          className="transition-transform duration-700 group-hover:scale-105"
          overlay={
            <>
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4">
                <p className="text-[9px] font-black text-white uppercase tracking-tighter truncate">
                  {item.title}
                </p>
              </div>
            </>
          }
        />
      </article>
    );
  }
);

export default SmartMasonry;
