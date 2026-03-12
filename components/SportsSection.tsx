
import React, { useState, useEffect, useRef } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import SportsBentoGrid from './SportsBentoGrid';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';

const SportsSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { rootMargin: '800px' }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="sports" className="py-12 md:py-24 bg-[#f8f9fa] overflow-hidden relative">
            <ArchiveHeader number="02" title={t.nav_sports} slogan={t.slogan_sports} bgText="ACTION" bgTextColor="text-blue-600/[0.04]" />
            <div className="w-full px-5 md:px-10 mb-8 md:mb-12 mt-8">
                {isVisible && <SportsBentoGrid items={photos} onImageClick={onImageClick} />}
            </div>
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_sports} />}
            <div className="flex justify-center mt-10"><BigAlbumButton label={t.cta_sports} onClick={onViewAll} /></div>
        </section>
    );
};

export default SportsSection;
