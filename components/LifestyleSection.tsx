
import React from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import LifestyleBentoGrid from './LifestyleBentoGrid';
import { ProductCard, Language } from '../types';

const LifestyleSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
    return (
        <section id="lifestyle" className="py-12 md:py-24 bg-white overflow-hidden relative border-t border-gray-100">
            <ArchiveHeader number="09" title={t.nav_lifestyle} slogan={t.slogan_lifestyle} bgText="PASSION" bgTextColor="text-blue-500/[0.04]" />
            <div className="w-full mb-8 md:mb-12 px-5 md:px-10 mt-8 relative z-10">
                <LifestyleBentoGrid items={photos} onImageClick={onImageClick} />
            </div>
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_lifestyle} />}
            <div className="flex justify-center mt-10"><BigAlbumButton label={t.cta_lifestyle} onClick={onViewAll} /></div>
        </section>
    );
};

export default LifestyleSection;
