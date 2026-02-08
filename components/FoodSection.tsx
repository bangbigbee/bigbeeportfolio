
import React, { useMemo, memo, useState } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

const FoodImage = memo(({ photo, onClick, isPriority }: { photo: ProductCard; onClick: () => void; isPriority?: boolean }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const thumbUrl = useMemo(() => getCloudinaryUrl(photo.imageUrl, 'grid'), [photo.imageUrl]);

    return (
        <div 
            onClick={onClick}
            className="group relative rounded-[6px] overflow-hidden cursor-pointer transform-gpu shadow-sm bg-[#f2f2f2]"
            style={{ isolation: 'isolate', aspectRatio: photo.width && photo.height ? photo.width / photo.height : 0.75 }}
        >
            {!isLoaded && <div className="absolute inset-0 shimmer-bg z-[1]" />}
            <img 
                src={thumbUrl} 
                loading={isPriority ? "eager" : "lazy"}
                fetchPriority={isPriority ? "high" : "auto"}
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-all duration-[1200ms] image-load-fade ${isLoaded ? 'loaded opacity-100' : 'opacity-0'}`} 
                alt={photo.title} 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4">
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">{photo.title}</p>
            </div>
        </div>
    );
});

const FoodSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
    // Chuyển sang 5 cột cho desktop
    const columns = useMemo(() => {
        const colCount = 5; 
        const cols: ProductCard[][] = Array.from({ length: colCount }, () => []);
        if (!photos || photos.length === 0) return cols;
        photos.forEach((p, idx) => { if (p) cols[idx % colCount].push(p); });
        return cols.map(col => {
            let res = [...col];
            // Đảm bảo đủ độ dài cho hiệu ứng scroll mượt
            while (res.length < 10 && photos.length > 0) res = [...res, ...col];
            return res;
        });
    }, [photos]);

    return (
        <section id="food-beverage" className="py-12 md:py-24 bg-[#ffffff] text-black overflow-hidden relative">
            <ArchiveHeader number="01" title={t.nav_food_beverage} slogan={t.slogan_food_beverage} />
            
            <div className="w-full mb-12 md:mb-16 h-[650px] md:h-[900px] relative overflow-hidden px-5 md:px-10 z-10">
                {/* Sử dụng md:grid-cols-5 để hiển thị 5 cột */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 h-full mask-fade-edges-v">
                    {columns.map((col, idx) => (
                        <div 
                            key={idx} 
                            className="flex flex-col gap-2 md:gap-3 animate-scroll-v hover:[animation-play-state:paused]" 
                            style={{ animationDuration: `${25 + idx * 7}s` }} // Tăng tốc độ scroll nhẹ cho cảm giác linh hoạt
                        >
                            {[...col, ...col].map((p, i) => (
                                <FoodImage 
                                    key={`${idx}-${i}-${p.id}`} 
                                    photo={p} 
                                    onClick={() => onImageClick(p)} 
                                    isPriority={i < 3} // Ưu tiên tải 3 ảnh đầu mỗi cột
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_food} />}
            <div className="flex justify-center mt-10"><BigAlbumButton label={t.cta_food_beverage} onClick={onViewAll} /></div>
        </section>
    );
};

export default FoodSection;
