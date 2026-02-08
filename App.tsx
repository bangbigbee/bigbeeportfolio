
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FoodSection from './components/FoodSection';
import SportsSection from './components/SportsSection';
import WeddingSection from './components/WeddingSection';
import InteriorSection from './components/InteriorSection';
import ProfileSection from './components/ProfileSection';
import EventSection from './components/EventSection';
import RealEstateSection from './components/RealEstateSection';
import CommercialSection from './components/CommercialSection';
import LifestyleSection from './components/LifestyleSection';
import ProcessSection from './components/ProcessSection';
import Lightbox from './components/Lightbox';
import GalleryPage from './components/GalleryPage';
import Footer from './components/Footer';
import { ProductCard, Language } from './types';
import { CLOUDINARY_CONFIG, UI_ASSETS } from './assets';
import { FALLBACK_TRANSLATIONS, TranslationStore } from './translations';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1OkD3CSvIlOpuYh21i8tPztPeyLph3PSbKGHrjwOUXFc/export?format=csv";
const STORAGE_KEY = 'bigbee_data_cache_v10';
const CACHE_TTL = 3600000; 

type AppView = 'home' | 'gallery';

interface LightboxState {
    items: ProductCard[];
    index: number;
}

export const getCloudinaryUrl = (url: string, quality: 'hero' | 'grid' | 'full' | 'preview' | 'thumb' | 'high' | 'micro' = 'grid') => {
    if (!url || !url.includes('cloudinary.com')) return url;
    if (url.includes('/video/') || url.endsWith('.mp4')) return url;
    
    let transform = 'f_auto,q_auto';
    switch(quality) {
        case 'hero': transform = 'f_auto,q_auto:best,w_2000,c_limit'; break;
        case 'grid': transform = 'f_auto,q_auto:good,w_1000,c_limit'; break;
        case 'full': transform = 'f_auto,q_auto:best,w_3000,c_limit'; break;
        case 'preview': transform = 'f_auto,q_auto:good,w_1200,c_limit'; break;
        case 'thumb': transform = 'f_auto,q_auto:good,w_600,c_limit'; break;
        case 'high': transform = 'f_auto,q_auto:best,w_1920,c_limit'; break;
        case 'micro': transform = 'f_auto,q_auto:low,w_200,c_limit'; break;
    }

    if (url.includes('/upload/')) {
        return url.replace('/upload/', `/upload/${transform}/`);
    }
    return url;
};

const extractYoutubeId = (input: string) => {
    if (!input) return null;
    let target = input.trim();
    if (target.includes('<iframe')) {
        const srcMatch = target.match(/src=["']([^"']+)["']/);
        if (srcMatch) target = srcMatch[1];
    }
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = target.match(regExp);
    return (match && match[7].length === 11) ? match[7] : (target.length === 11 ? target : null);
};

const parseCSVRow = (row: string) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
        else current += char;
    }
    result.push(current.trim());
    return result.map(s => s.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
};

const App: React.FC = () => {
    const [view, setView] = useState<AppView>('home');
    const [lang, setLang] = useState<Language>('vi');
    const [translations, setTranslations] = useState<TranslationStore>(() => {
        try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_TTL) return data;
            }
        } catch (e) {}
        return FALLBACK_TRANSLATIONS;
    });

    const [lightbox, setLightbox] = useState<LightboxState | null>(null);
    const [initialAlbumKey, setInitialAlbumKey] = useState<string>('food-beverage');
    const [initialSubKey, setInitialSubKey] = useState<string | null>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [youtubeVideosMap, setYoutubeVideosMap] = useState<Record<string, ProductCard[]>>({});

    const [foodPhotos, setFoodPhotos] = useState<ProductCard[]>([]);
    const [sportsPhotos, setSportsPhotos] = useState<ProductCard[]>([]);
    const [weddingCollections, setWeddingCollections] = useState<Record<string, ProductCard[]>>({ all: [] });
    const [interiorPhotos, setInteriorPhotos] = useState<ProductCard[]>([]);
    const [profilePhotos, setProfilePhotos] = useState<ProductCard[]>([]);
    const [eventPhotos, setEventPhotos] = useState<ProductCard[]>([]);
    const [realEstatePhotos, setRealEstatePhotos] = useState<ProductCard[]>([]);
    const [commercialPhotos, setCommercialPhotos] = useState<ProductCard[]>([]);
    const [lifestylePhotos, setLifestylePhotos] = useState<ProductCard[]>([]);

    const allDataFetched = useRef(false);
    const backgroundLoadingStarted = useRef(false);
    const t = useMemo(() => translations[lang], [translations, lang]);

    const mapRes = useCallback((data: any, catName: string) => {
        if (!data || !data.resources) return [];
        return data.resources.map((res: any, idx: number) => {
            const versionPart = res.version ? `v${res.version}/` : '';
            const resType = res.resource_type || 'image';
            const base = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/${resType}/upload/${versionPart}${res.public_id}`;
            return {
                id: `${catName}-${res.public_id}-${idx}`,
                category: catName,
                title: `${catName} #${idx + 1}`,
                subtitle: 'Visual Excellence',
                imageUrl: resType === 'video' ? `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/video/upload/${versionPart}${res.public_id}.jpg` : `${base}.${res.format || 'jpg'}`,
                videoUrl: resType === 'video' ? `${base}.${res.format || 'mp4'}` : undefined,
                resourceType: resType === 'video' ? 'video' as const : 'image' as const,
                width: res.width,
                height: res.height
            };
        });
    }, []);

    // Ưu tiên tải FoodSection sớm ngay khi có data
    useEffect(() => {
        if (foodPhotos.length > 0) {
            foodPhotos.slice(0, 15).forEach((item) => {
                const img = new Image();
                img.src = getCloudinaryUrl(item.imageUrl, 'grid');
            });
        }
    }, [foodPhotos]);

    // Logic Tải Ngầm Toàn Bộ Ảnh Sau 15 Giây cho các phần còn lại
    useEffect(() => {
        const timer = setTimeout(() => {
            if (backgroundLoadingStarted.current) return;
            backgroundLoadingStarted.current = true;
            
            console.log("BigBee Engine: Kích hoạt tải ngầm bộ nhớ đệm hình ảnh (15s delay)...");
            
            const allCollections = [
                sportsPhotos, interiorPhotos, profilePhotos, 
                eventPhotos, realEstatePhotos, commercialPhotos, lifestylePhotos,
                ...Object.values(weddingCollections)
            ].flat();

            const uniqueUrls = Array.from(new Set(
                allCollections
                    .filter(item => item && item.imageUrl && item.resourceType !== 'video')
                    .map(item => getCloudinaryUrl(item.imageUrl, 'grid'))
            ));

            uniqueUrls.forEach((url, index) => {
                setTimeout(() => {
                    const img = new Image();
                    img.src = url;
                }, index * 100); 
            });
            
        }, 15000); 

        return () => clearTimeout(timer);
    }, [sportsPhotos, interiorPhotos, profilePhotos, eventPhotos, realEstatePhotos, commercialPhotos, lifestylePhotos, weddingCollections]);

    const fetchTranslations = useCallback(async () => {
        try {
            const response = await fetch(`${SHEET_URL}&t=${Date.now()}`);
            const csvText = await response.text();
            const rows = csvText.split(/\r?\n/).map(row => parseCSVRow(row));
            const newTranslations: TranslationStore = JSON.parse(JSON.stringify(FALLBACK_TRANSLATIONS));
            const rawYoutubeData: Record<string, string[]> = {};

            rows.forEach((row, index) => {
                if (index === 0 || row.length < 2) return;
                const key = row[0]?.trim();
                if (!key) return;
                if (key.startsWith('video_') && !key.includes('_title_')) {
                    const sectionName = key.replace('video_', '').trim();
                    const ids = row.slice(1).map(val => extractYoutubeId(val)).filter(Boolean) as string[];
                    if (ids.length > 0) rawYoutubeData[sectionName] = ids;
                } else {
                    const vi = row[1]?.trim();
                    const en = row[2]?.trim() || vi;
                    if (vi) { newTranslations.vi[key] = vi; newTranslations.en[key] = en; }
                }
            });

            const newYoutubeMap: Record<string, ProductCard[]> = {};
            Object.keys(rawYoutubeData).forEach(sectionName => {
                const ids = rawYoutubeData[sectionName];
                const titleKey = `video_title_${sectionName}`;
                const sectionTitle = newTranslations[lang][titleKey] || sectionName.toUpperCase();
                newYoutubeMap[sectionName] = ids.map((id, idx) => ({
                    id: `yt-${sectionName}-${idx}`,
                    category: sectionName.toUpperCase(),
                    title: ids.length > 1 ? `${sectionTitle} #${idx + 1}` : sectionTitle,
                    subtitle: lang === 'vi' ? 'Sản xuất bởi BigBee' : 'Produced by BigBee',
                    imageUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
                    youtubeId: id,
                    resourceType: 'video' as const,
                }));
            });
            setTranslations(newTranslations);
            setYoutubeVideosMap(newYoutubeMap);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: newTranslations, timestamp: Date.now() }));
        } catch (error) {}
    }, [lang]);

    const fetchAllData = useCallback(async () => {
        if (allDataFetched.current) return;
        allDataFetched.current = true;
        const endpoints = [
            { url: CLOUDINARY_CONFIG.FOOD_JSON, setter: (p: ProductCard[]) => setFoodPhotos(p), cat: "Food & Beverage" },
            { url: CLOUDINARY_CONFIG.SPORTS_JSON, setter: (p: ProductCard[]) => setSportsPhotos(p), cat: "Sports" },
            { url: CLOUDINARY_CONFIG.INTERIOR_JSON, setter: (p: ProductCard[]) => setInteriorPhotos(p), cat: "Interior" },
            { url: CLOUDINARY_CONFIG.PROFILE_JSON, setter: (p: ProductCard[]) => setProfilePhotos(p), cat: "Profile" },
            { url: CLOUDINARY_CONFIG.WEDDING1_JSON, setter: (p: ProductCard[]) => setWeddingCollections(prev => ({ ...prev, wedding_item_1: p, all: [...(prev.all || []), ...p] })), cat: "Wedding" },
            { url: CLOUDINARY_CONFIG.EVENT_JSON, setter: (p: ProductCard[]) => setEventPhotos(p), cat: "Event" },
            { url: CLOUDINARY_CONFIG.REALESTATE_IMG_JSON, setter: (p: ProductCard[]) => setRealEstatePhotos(p), cat: "Real Estate" },
            { url: CLOUDINARY_CONFIG.COMMERCIAL_JSON, setter: (p: ProductCard[]) => setCommercialPhotos(p), cat: "Commercial" },
            { url: CLOUDINARY_CONFIG.LIFESTYLE_JSON, setter: (p: ProductCard[]) => setLifestylePhotos(p), cat: "Lifestyle" },
        ];
        endpoints.forEach(async (ep) => {
            try {
                const res = await fetch(ep.url);
                if (res.ok) { const data = await res.json(); ep.setter(mapRes(data, ep.cat)); }
            } catch (e) {}
        });
        [2, 3, 4, 5, 6].forEach(async (num) => {
            try {
                const res = await fetch((CLOUDINARY_CONFIG as any)[`WEDDING${num}_JSON`]);
                if (res.ok) { 
                    const data = await res.json(); 
                    const mapped = mapRes(data, "Wedding");
                    setWeddingCollections(prev => ({ 
                        ...prev, 
                        [`wedding_item_${num}`]: mapped,
                        all: [...(prev.all || []), ...mapped] 
                    })); 
                }
            } catch (e) {}
        });
    }, [mapRes]);

    useEffect(() => { fetchTranslations(); fetchAllData(); }, [fetchTranslations, fetchAllData]);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            setScrollProgress((winScroll / height) * 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openAlbumHub = (albumKey: string, subKey: string | null = null) => { 
        setInitialAlbumKey(albumKey); 
        setInitialSubKey(albumKey === 'wedding' && !subKey ? 'wedding_item_1' : subKey);
        setView('gallery'); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    const openLightbox = (items: ProductCard[], index: number) => {
        if (index === -1 || !items[index]) return;
        setLightbox({ items, index });
    };

    const getRealEstateVideoList = useMemo(() => youtubeVideosMap['real_estate'] || youtubeVideosMap['realestate'] || [], [youtubeVideosMap]);

    return (
        <div className="min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
            <Navbar onLogoClick={() => setView('home')} lang={lang} setLang={setLang} isSolid={view === 'gallery'} scrollProgress={scrollProgress} t={t} />
            <main>
                {view === 'home' ? (
                    <>
                        <Hero lang={lang} t={t} backgroundImage={UI_ASSETS.HERO_BG} />
                        <FoodSection onImageClick={(img) => openLightbox(img.resourceType === 'video' ? (youtubeVideosMap['food'] || []) : foodPhotos, (img.resourceType === 'video' ? (youtubeVideosMap['food'] || []) : foodPhotos).indexOf(img))} onViewAll={() => openAlbumHub('food-beverage')} lang={lang} t={t} photos={foodPhotos} videos={youtubeVideosMap['food'] || []} />
                        <SportsSection onImageClick={(img) => openLightbox(img.resourceType === 'video' ? (youtubeVideosMap['sports'] || []) : sportsPhotos, (img.resourceType === 'video' ? (youtubeVideosMap['sports'] || []) : sportsPhotos).indexOf(img))} onViewAll={() => openAlbumHub('sports')} lang={lang} t={t} photos={sportsPhotos} videos={youtubeVideosMap['sports'] || []} />
                        <WeddingSection onImageClick={(img) => openLightbox(img.resourceType === 'video' ? (youtubeVideosMap['wedding'] || []) : (weddingCollections[initialSubKey || 'wedding_item_1'] || []), (img.resourceType === 'video' ? (youtubeVideosMap['wedding'] || []) : (weddingCollections[initialSubKey || 'wedding_item_1'] || [])).indexOf(img))} onViewAll={(sub) => openAlbumHub('wedding', sub)} lang={lang} t={t} weddingCollections={weddingCollections} weddingVideos={youtubeVideosMap['wedding'] || []} />
                        <InteriorSection onImageClick={(img) => openLightbox(img.resourceType === 'video' ? (youtubeVideosMap['interior'] || []) : interiorPhotos, (img.resourceType === 'video' ? (youtubeVideosMap['interior'] || []) : interiorPhotos).indexOf(img))} onViewAll={() => openAlbumHub('interior')} lang={lang} t={t} customHospitality={interiorPhotos} videos={youtubeVideosMap['interior'] || []} />
                        <ProfileSection onImageClick={(img) => openLightbox(img.resourceType === 'video' ? (youtubeVideosMap['profile'] || []) : profilePhotos, (img.resourceType === 'video' ? (youtubeVideosMap['profile'] || []) : profilePhotos).indexOf(img))} onViewAll={() => openAlbumHub('profile')} lang={lang} t={t} photos={profilePhotos} videos={youtubeVideosMap['profile'] || []} />
                        <EventSection onImageClick={(img) => openLightbox(img.resourceType === 'video' ? (youtubeVideosMap['event'] || []) : eventPhotos, (img.resourceType === 'video' ? (youtubeVideosMap['event'] || []) : eventPhotos).indexOf(img))} onViewAll={() => openAlbumHub('event')} lang={lang} t={t} customEventPhotos={eventPhotos} videos={youtubeVideosMap['event'] || []} />
                        <RealEstateSection onImageClick={(img) => openLightbox(img.resourceType === 'video' ? getRealEstateVideoList : realEstatePhotos, (img.resourceType === 'video' ? getRealEstateVideoList : realEstatePhotos).indexOf(img))} onViewAll={() => openAlbumHub('real_estate')} lang={lang} t={t} videos={getRealEstateVideoList} photos={realEstatePhotos} />
                        <CommercialSection onImageClick={(img) => openLightbox(img.resourceType === 'video' ? (youtubeVideosMap['commercial'] || []) : commercialPhotos, (img.resourceType === 'video' ? (youtubeVideosMap['commercial'] || []) : commercialPhotos).indexOf(img))} onViewAll={() => openAlbumHub('commercial')} lang={lang} t={t} photos={commercialPhotos} videos={youtubeVideosMap['commercial'] || []} />
                        <LifestyleSection onImageClick={(img) => openLightbox(img.resourceType === 'video' ? (youtubeVideosMap['lifestyle'] || []) : lifestylePhotos, (img.resourceType === 'video' ? (youtubeVideosMap['lifestyle'] || []) : lifestylePhotos).indexOf(img))} onViewAll={() => openAlbumHub('lifestyle')} lang={lang} t={t} photos={lifestylePhotos} videos={youtubeVideosMap['lifestyle'] || []} />
                        <ProcessSection lang={lang} t={t} />
                        <section id="studio" className="relative h-[40vh] bg-black flex items-center justify-center">
                            <div className="absolute inset-0 opacity-40"><img src={UI_ASSETS.CONTACT_BG} className="w-full h-full object-cover" alt="BigBee" loading="lazy" /></div>
                            <div className="relative z-10 text-center px-6">
                                <h2 className="text-4xl md:text-8xl font-black text-white uppercase mb-8 tracking-tighter">{t.studio_title || "BIGBEE STUDIO"}</h2>
                                <a href={t.link_contact_action} className="bg-white text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl inline-block rounded-[6px]">{t.studio_section_cta}</a>
                            </div>
                        </section>
                    </>
                ) : (
                    <GalleryPage 
                        initialAlbumKey={initialAlbumKey} initialSubKey={initialSubKey} onBack={() => setView('home')} onImageClick={(img, items) => openLightbox(items, items.indexOf(img))} lang={lang} t={t}
                        dynamicFood={foodPhotos} dynamicFoodVideos={youtubeVideosMap['food'] || []} dynamicSports={sportsPhotos} dynamicSportsVideos={youtubeVideosMap['sports'] || []} dynamicHospitality={interiorPhotos} dynamicHospitalityVideos={youtubeVideosMap['interior'] || []}
                        dynamicEvents={eventPhotos} dynamicEventsVideos={youtubeVideosMap['event'] || []} dynamicProfile={profilePhotos} dynamicProfileVideos={youtubeVideosMap['profile'] || []} dynamicRealEstateVideos={getRealEstateVideoList} dynamicRealEstatePhotos={realEstatePhotos}
                        dynamicCommercial={commercialPhotos} dynamicCommercialVideos={youtubeVideosMap['commercial'] || []} dynamicLifestyle={lifestylePhotos} dynamicLifestyleVideos={youtubeVideosMap['lifestyle'] || []} weddingCollections={weddingCollections} 
                        weddingVideos={youtubeVideosMap['wedding'] || []}
                    />
                )}
            </main>
            <Footer lang={lang} t={t} />
            {lightbox && <Lightbox items={lightbox.items} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />}
        </div>
    );
};

export default App;
