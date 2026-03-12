
import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProductCard, Language } from '../types';
import SmartMasonry from './SmartMasonry';
import { getOptimizedUrl } from '../App';

interface GalleryPageProps {
    initialAlbumKey?: string;
    initialSubKey?: string | null;
    onBack: () => void;
    onImageClick: (img: ProductCard, items: ProductCard[]) => void;
    lang: Language;
    t: Record<string, string>;
    dynamicFood?: ProductCard[];
    dynamicFoodVideos?: ProductCard[];
    dynamicSports?: ProductCard[];
    dynamicSportsVideos?: ProductCard[];
    dynamicHospitality?: ProductCard[];
    dynamicHospitalityVideos?: ProductCard[];
    dynamicEvents?: ProductCard[];
    dynamicEventsVideos?: ProductCard[];
    dynamicProfile?: ProductCard[];
    dynamicProfileVideos?: ProductCard[];
    dynamicRealEstatePhotos?: ProductCard[];
    dynamicRealEstateVideos?: ProductCard[];
    dynamicCommercial?: ProductCard[];
    dynamicCommercialVideos?: ProductCard[];
    dynamicLifestyle?: ProductCard[];
    dynamicLifestyleVideos?: ProductCard[];
    weddingCollections?: Record<string, ProductCard[]>;
    weddingVideos?: ProductCard[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({ 
    initialAlbumKey = 'food-beverage',
    initialSubKey = null,
    onBack, onImageClick, lang, t,
    dynamicFood = [], dynamicFoodVideos = [],
    dynamicSports = [], dynamicSportsVideos = [],
    dynamicHospitality = [], dynamicHospitalityVideos = [],
    dynamicEvents = [], dynamicEventsVideos = [],
    dynamicProfile = [], dynamicProfileVideos = [],
    dynamicRealEstatePhotos = [], dynamicRealEstateVideos = [],
    dynamicCommercial = [], dynamicCommercialVideos = [],
    dynamicLifestyle = [], dynamicLifestyleVideos = [],
    weddingCollections = { all: [] },
    weddingVideos = []
}) => {
    const [activeTab, setActiveTab] = useState(initialAlbumKey);
    const [activeSubTab, setActiveSubTab] = useState<string>(initialSubKey || 'all');
    const [visibleCount, setVisibleCount] = useState(18);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const ALBUMS_CONFIG = useMemo(() => [
        { key: 'food-beverage', title: t.nav_food_beverage, photos: dynamicFood, videos: dynamicFoodVideos },
        { key: 'sports', title: t.nav_sports, photos: dynamicSports, videos: dynamicSportsVideos },
        { key: 'wedding', title: t.nav_wedding, photos: weddingCollections['all'] || [], videos: weddingVideos },
        { key: 'interior', title: t.nav_interior, photos: dynamicHospitality, videos: dynamicHospitalityVideos },
        { key: 'profile', title: t.nav_profile, photos: dynamicProfile, videos: dynamicProfileVideos },
        { key: 'event', title: t.nav_event, photos: dynamicEvents, videos: dynamicEventsVideos },
        { key: 'real_estate', title: t.nav_real_estate, photos: dynamicRealEstatePhotos, videos: dynamicRealEstateVideos },
        { key: 'commercial', title: t.nav_commercial, photos: dynamicCommercial, videos: dynamicCommercialVideos },
        { key: 'lifestyle', title: t.nav_lifestyle, photos: dynamicLifestyle, videos: dynamicLifestyleVideos },
    ], [t, dynamicFood, dynamicFoodVideos, dynamicSports, dynamicSportsVideos, dynamicHospitality, dynamicHospitalityVideos, dynamicEvents, dynamicEventsVideos, dynamicProfile, dynamicProfileVideos, dynamicRealEstatePhotos, dynamicRealEstateVideos, dynamicCommercial, dynamicCommercialVideos, dynamicLifestyle, dynamicLifestyleVideos, weddingCollections, weddingVideos]);

    const activeAlbum = useMemo(() => ALBUMS_CONFIG.find(a => a.key === activeTab), [activeTab, ALBUMS_CONFIG]);

    const subTabs = useMemo(() => {
        const tabs: { key: string; label: string }[] = [];
        
        if (activeTab !== 'wedding') {
            tabs.push({ key: 'all', label: lang === 'vi' ? 'HÌNH ẢNH' : 'PHOTOGRAPHY' });
        } else {
            for (let i = 1; i <= 6; i++) {
                const key = `wedding_item_${i}`;
                if (weddingCollections[key] && weddingCollections[key].length > 0) {
                    tabs.push({ key, label: (t[key] || `VOL.${i}`).toUpperCase() });
                }
            }
        }

        if (activeAlbum && activeAlbum.videos && activeAlbum.videos.length > 0) {
            tabs.push({ key: 'films', label: lang === 'vi' ? 'VIDEO (FILMS)' : 'CINEMATIC FILMS' });
        }
        
        return tabs;
    }, [activeTab, activeAlbum, weddingCollections, lang, t]);

    const filteredContent = useMemo(() => {
        if (!activeAlbum) return [];
        if (activeSubTab === 'films') return activeAlbum.videos || [];
        if (activeTab === 'wedding') return weddingCollections[activeSubTab] || [];
        return activeAlbum.photos || [];
    }, [activeTab, activeSubTab, activeAlbum, weddingCollections]);

    const visibleItems = useMemo(() => filteredContent.slice(0, visibleCount), [filteredContent, visibleCount]);

    // Infinite Scroll Implementation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < filteredContent.length) {
                    // Use a functional update to ensure we have the latest count
                    setVisibleCount(prev => Math.min(prev + 18, filteredContent.length));
                }
            },
            { threshold: 0.01, rootMargin: '800px' }
        );

        const sentinel = document.getElementById('scroll-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [visibleCount, filteredContent.length]);

    const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>, key: string) => {
        setActiveTab(key);
        if (key === 'wedding') setActiveSubTab('wedding_item_1');
        else setActiveSubTab('all');
        setVisibleCount(18);
        e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    const handleSubTabClick = (e: React.MouseEvent<HTMLButtonElement>, key: string) => {
        setActiveSubTab(key);
        setVisibleCount(18);
        e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsInitialLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white pt-16 md:pt-24 pb-12 overflow-x-hidden">
            <div className="w-full px-4 md:px-10 max-w-[1600px] mx-auto">
                {/* Back Button */}
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-gray-400 mb-8 uppercase hover:text-black transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> {lang === 'vi' ? 'QUAY LẠI' : 'BACK TO HOME'}
                </button>

                {/* Title Section */}
                <div className="mb-8 md:mb-12">
                    <span className="text-[10px] font-black text-blue-600 tracking-[0.5em] uppercase mb-2 block">
                        ARCHIVE {ALBUMS_CONFIG.findIndex(a => a.key === activeTab) + 1}
                    </span>
                    <h1 className="text-4xl md:text-[6.5rem] font-black tracking-tighter uppercase leading-[0.85] break-words">
                        {activeAlbum?.title}<span className="text-blue-600">.</span>
                    </h1>
                </div>

                {/* Main Category Tabs - Giảm margin bottom xuống tối thiểu */}
                <div className="relative mb-2 md:mb-3 sticky top-[56px] md:top-[80px] bg-white z-40">
                    <div className="flex gap-8 overflow-x-auto hide-scrollbar border-b border-gray-100 py-3 -mx-4 px-4 md:-mx-10 md:px-10">
                        {ALBUMS_CONFIG.map(a => (
                            <button 
                                key={a.key} 
                                onClick={(e) => handleTabClick(e, a.key)} 
                                className={`whitespace-nowrap text-[11px] md:text-[12px] font-black tracking-[0.2em] uppercase relative transition-colors py-2 ${activeTab === a.key ? 'text-black' : 'text-gray-300 hover:text-gray-500'}`}
                            >
                                {a.title}
                                {activeTab === a.key && (
                                    <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-black z-10" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sub Tabs - Giảm khoảng cách phía trên bằng cách rút gọn padding/margin */}
                {subTabs.length > 1 && (
                    <div className="relative mb-8 mt-1">
                        <div className="flex overflow-x-auto hide-scrollbar -mx-4 px-4 md:-mx-10 md:px-10 py-2 overflow-visible">
                            <div className="flex gap-2.5 min-w-max">
                                {subTabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={(e) => handleSubTabClick(e, tab.key)}
                                        className={`px-5 py-2.5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-300 transform-gpu
                                            ${activeSubTab === tab.key 
                                                ? 'bg-black text-white border-black shadow-lg scale-100 z-10' 
                                                : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300 hover:text-black z-0'
                                            }
                                        `}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Grid */}
                <div className="min-h-[60vh] w-full mt-2">
                    {visibleItems.length > 0 ? (
                        <>
                            <SmartMasonry 
                                items={visibleItems} 
                                onImageClick={(img) => onImageClick(img, filteredContent)} 
                            />
                            
                            {/* Scroll Sentinel for Infinite Scroll */}
                            <div id="scroll-sentinel" className="h-20 w-full flex items-center justify-center mt-8">
                                {visibleCount < filteredContent.length && (
                                    <div className="flex flex-col items-center">
                                        <div className="w-6 h-6 border-2 border-gray-100 border-t-black rounded-full animate-spin mb-2" />
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">
                                            {lang === 'vi' ? 'ĐANG TẢI THÊM...' : 'LOADING MORE...'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40">
                            {!isInitialLoading && (
                                <>
                                    <div className="w-12 h-12 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-6" />
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Đang đồng bộ visual...</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryPage;
