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
import { IMAGE_DATA } from './image-data';
import { GITHUB_CONFIG, UI_ASSETS } from './assets';
import { FALLBACK_TRANSLATIONS, TranslationStore } from './translations';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1OkD3CSvIlOpuYh21i8tPztPeyLph3PSbKGHrjwOUXFc/export?format=csv";
const STORAGE_KEY = 'bigbee_data_cache_v19';
const CACHE_TTL = 300000; // 5 minutes

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for persistent cache
const GITHUB_DATA_CACHE_KEY = 'bigbee_github_tree_cache';
const fetchPromises = new Map<string, Promise<any>>();

async function fetchWithCache(url: string) {
    if (!url) return null;

    if (fetchPromises.has(url)) {
        return fetchPromises.get(url);
    }

    const cacheKey = `app_cache_${url}`;
    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_DURATION) {
                return parsed.data;
            }
        }
    } catch (e) {
        console.warn("Cache read error", e);
    }

    const fetchPromise = fetch(url)
        .then(r => {
            if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
            return r.json();
        })
        .then(data => {
            try {
                localStorage.setItem(cacheKey, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.warn("Cache write error", e);
            }
            fetchPromises.delete(url);
            return data;
        })
        .catch(err => {
            fetchPromises.delete(url);
            throw err;
        });

    fetchPromises.set(url, fetchPromise);
    return fetchPromise;
}

export const getOptimizedUrl = (url: string | undefined, _transform?: 'thumb' | 'preview' | 'full') => {
    if (!url || typeof url !== 'string') return undefined;

    // Normalize GitHub URLs
    let rawUrl = url;
    if (url.includes('github.com') && url.includes('/blob/')) {
        rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }

    // Use wsrv.nl for ALL images to ensure they are converted to WebP and optimized
    // We use a SINGLE consistent set of parameters for every image to ensure the URL 
    // is identical everywhere in the app. This allows the browser and Service Worker 
    // to cache the image once and reuse it for thumbnails, previews, and full views.
    try {
        const wsrvUrl = new URL('https://wsrv.nl/');
        wsrvUrl.searchParams.set('url', rawUrl);
        wsrvUrl.searchParams.set('output', 'webp');
        wsrvUrl.searchParams.set('w', '1200'); // Optimized width for all views
        wsrvUrl.searchParams.set('q', '75');   // Optimized quality
        wsrvUrl.searchParams.set('maxage', '1d'); // Cache for 24 hours as requested
        
        return wsrvUrl.toString();
    } catch (e) {
        return rawUrl;
    }
};

type AppView = 'home' | 'gallery';

interface LightboxState {
    items: ProductCard[];
    index: number;
}

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
                if (Date.now() - timestamp < CACHE_TTL) return data.translations || data;
            }
        } catch (e) {}
        return FALLBACK_TRANSLATIONS;
    });

    const [youtubeVideosMap, setYoutubeVideosMap] = useState<Record<string, ProductCard[]>>(() => {
        try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_TTL && data.youtubeVideosMap) return data.youtubeVideosMap;
            }
        } catch (e) {}
        return {};
    });

    const [lightbox, setLightbox] = useState<LightboxState | null>(null);
    const [initialAlbumKey, setInitialAlbumKey] = useState<string>('food-beverage');
    const [initialSubKey, setInitialSubKey] = useState<string | null>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const [heroBackground, setHeroBackground] = useState<string>(UI_ASSETS.HERO_BG);
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
    const t = useMemo(() => translations[lang], [translations, lang]);

    const mapRes = useCallback((data: any, catName: string, type: 'image' | 'video' = 'image') => {
        if (!data) return [];
        
        if (Array.isArray(data)) {
            return data
                .filter((res: any) => {
                    if (res.download_url) {
                        return /\.(jpg|jpeg|png|webp|gif)$/i.test(res.name);
                    }
                    return true;
                })
                .map((res: any, idx: number) => {
                    let imageUrl = res.urls?.regular || res.urls?.full || res.urls?.raw || res.download_url;
                    
                    return {
                        id: `${catName}-${res.id || res.sha || idx}-${idx}`,
                        category: catName,
                        title: `${catName} #${idx + 1}`,
                        subtitle: 'Visual Excellence',
                        imageUrl: imageUrl,
                        resourceType: 'image',
                        width: res.width,
                        height: res.height,
                        aspectRatio: res.width && res.height ? `${res.width}/${res.height}` : undefined
                    };
                });
        }

        return [];
    }, []);

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
            console.log('newYoutubeMap:', newYoutubeMap);
            setYoutubeVideosMap(prev => ({ ...prev, ...newYoutubeMap }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
                data: { translations: newTranslations, youtubeVideosMap: newYoutubeMap }, 
                timestamp: Date.now() 
            }));
        } catch (error) {}
    }, [lang]);

    const fetchAllData = useCallback(async (currentImageData: Record<string, {name: string, sha: string}[]>) => {
        const configs = [
            { key: 'food', setter: setFoodPhotos, cat: 'Food & Beverage' },
            { key: 'sports', setter: setSportsPhotos, cat: 'Sports' },
            { key: 'interior', setter: setInteriorPhotos, cat: 'Interior' },
            { key: 'profile', setter: setProfilePhotos, cat: 'Profile' },
            { key: 'event', setter: setEventPhotos, cat: 'Event' },
            { key: 'realestate', setter: setRealEstatePhotos, cat: 'Real Estate' },
            { key: 'commercial', setter: setCommercialPhotos, cat: 'Commercial' },
            { key: 'lifestyle', setter: setLifestylePhotos, cat: 'Lifestyle' }
        ];

        const newWeddingCollections: Record<string, ProductCard[]> = { all: [] };
        const allWeddingPhotos: ProductCard[] = [];

        // Process ALL folders from currentImageData
        Object.keys(currentImageData).forEach((folderKey) => {
            const rawFiles = currentImageData[folderKey] || [];
            if (rawFiles.length === 0) return;

            // Normalize files to {name, sha} to handle both GitHub data and fallback IMAGE_DATA
            const files = rawFiles.map(f => typeof f === 'string' ? { name: f, sha: 'v1' } : f);

            const lowerKey = folderKey.toLowerCase();
            
            // 1. Handle Background
            if (lowerKey === 'bg') {
                const bgData = files.map(file => ({
                    name: file.name,
                    download_url: `https://raw.githubusercontent.com/portbigbee/portfolio-photo/main/${folderKey}/${encodeURIComponent(file.name)}?v=${file.sha}`
                }));
                if (bgData.length > 0) {
                    setHeroBackground(bgData[0].download_url);
                }
                return;
            }

            // 2. Handle Wedding folders
            if (lowerKey.startsWith('wedding')) {
                const data = files.map(file => ({
                    name: file.name,
                    download_url: `https://raw.githubusercontent.com/portbigbee/portfolio-photo/main/${folderKey}/${encodeURIComponent(file.name)}?v=${file.sha}`
                }));
                const mapped = mapRes(data, 'Wedding', 'image');
                
                let itemNumStr = lowerKey.replace('wedding', '');
                let itemNum = itemNumStr === '' ? 1 : parseInt(itemNumStr);
                if (isNaN(itemNum)) itemNum = 1;

                const subKey = `wedding_item_${itemNum}`;
                newWeddingCollections[subKey] = [...(newWeddingCollections[subKey] || []), ...mapped];
                allWeddingPhotos.push(...mapped);
                return;
            }

            // 3. Handle other categories
            const config = configs.find(c => c.key.toLowerCase() === lowerKey || (c.key === 'realestate' && lowerKey === 'real_estate'));
            if (config) {
                const data = files.map(file => ({
                    name: file.name,
                    download_url: `https://raw.githubusercontent.com/portbigbee/portfolio-photo/main/${folderKey}/${encodeURIComponent(file.name)}?v=${file.sha}`
                }));
                const mapped = mapRes(data, config.cat, 'image');
                config.setter(mapped);
                return;
            }
        });

        // Deduplicate and set wedding collections
        const uniqueAll = Array.from(new Set(allWeddingPhotos.map(p => p.imageUrl)))
            .map(url => allWeddingPhotos.find(p => p.imageUrl === url)!);
        
        newWeddingCollections.all = uniqueAll;
        setWeddingCollections(newWeddingCollections);
    }, [mapRes]);

    const fetchGitHubData = useCallback(async () => {
        let cachedData: any = null;
        try {
            // 1. Try to load from localStorage cache first
            const cached = localStorage.getItem(GITHUB_DATA_CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                // Check if cache is older than 24 hours
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    cachedData = data;
                    fetchAllData(data);
                } else {
                    localStorage.removeItem(GITHUB_DATA_CACHE_KEY);
                }
            }

            // 2. Always fetch fresh data from GitHub on page load to check for new images
            const response = await fetch(`https://api.github.com/repos/portbigbee/portfolio-photo/git/trees/main?recursive=1&t=${Date.now()}`);
            if (!response.ok) throw new Error('Failed to fetch GitHub tree');
            
            const data = await response.json();
            const tree = data.tree || [];
            
            const newImageData: Record<string, {name: string, sha: string}[]> = {};
            
            tree.forEach((file: any) => {
                if (file.type === 'blob') {
                    const pathParts = file.path.split('/');
                    if (pathParts.length === 2) {
                        const folder = pathParts[0];
                        const fileName = pathParts[1];
                        if (/\.(jpg|jpeg|png|webp|gif)$/i.test(fileName)) {
                            if (!newImageData[folder]) newImageData[folder] = [];
                            newImageData[folder].push({ name: fileName, sha: file.sha });
                        }
                    }
                }
            });
            
            // 3. Only update state if data has actually changed to prevent unnecessary re-renders
            const newDataStr = JSON.stringify(newImageData);
            const cachedDataStr = JSON.stringify(cachedData);
            
            if (newDataStr !== cachedDataStr) {
                localStorage.setItem(GITHUB_DATA_CACHE_KEY, JSON.stringify({
                    data: newImageData,
                    timestamp: Date.now()
                }));
                fetchAllData(newImageData);
            }
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            if (!cachedData) {
                fetchAllData(IMAGE_DATA); // Final fallback
            }
        }
    }, [fetchAllData]);

    useEffect(() => { 
        fetchTranslations(); 
        fetchGitHubData();
    }, [fetchTranslations, fetchGitHubData]);

    const openAlbumHub = useCallback((albumKey: string, subKey: string | null = null) => { 
        setInitialAlbumKey(albumKey); 
        setInitialSubKey(albumKey === 'wedding' && !subKey ? 'wedding_item_1' : subKey);
        setView('gallery'); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }, []);

    const openLightbox = useCallback((items: ProductCard[], index: number) => {
        if (!items || items.length === 0 || index < 0 || index >= items.length) return;
        setLightbox({ items, index });
    }, []);

    const getRealEstateVideoList = useMemo(() => youtubeVideosMap['realestate'] || youtubeVideosMap['real_estate'] || [], [youtubeVideosMap]);

    useEffect(() => {
        let rafId: number;
        const handleScroll = () => {
            rafId = requestAnimationFrame(() => {
                const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (totalScroll > 0) {
                    setScrollProgress((window.scrollY / totalScroll) * 100);
                }
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
            <Navbar onLogoClick={() => setView('home')} lang={lang} setLang={setLang} isSolid={view === 'gallery'} scrollProgress={scrollProgress} t={t} />
            <main>
                {view === 'home' ? (
                    <>
                        <Hero lang={lang} t={t} backgroundImage={heroBackground} />
                        <FoodSection onImageClick={(img: ProductCard) => {
                            const list = img.resourceType === 'video' ? (youtubeVideosMap['food'] || []) : foodPhotos;
                            openLightbox(list, list.findIndex(p => p.id === img.id));
                        }} onViewAll={() => openAlbumHub('food-beverage')} lang={lang} t={t} photos={foodPhotos} videos={youtubeVideosMap['food'] || []} />
                        <SportsSection onImageClick={(img: ProductCard) => {
                            const list = img.resourceType === 'video' ? (youtubeVideosMap['sports'] || []) : sportsPhotos;
                            openLightbox(list, list.findIndex(p => p.id === img.id));
                        }} onViewAll={() => openAlbumHub('sports')} lang={lang} t={t} photos={sportsPhotos} videos={youtubeVideosMap['sports'] || []} />
                        <WeddingSection onImageClick={(img: ProductCard) => {
                            const currentWeddingSubKey = initialSubKey || 'wedding_item_1';
                            const list = img.resourceType === 'video' ? (youtubeVideosMap['wedding'] || []) : (weddingCollections[currentWeddingSubKey] || []);
                            openLightbox(list, list.findIndex(p => p.id === img.id));
                        }} onViewAll={(sub) => openAlbumHub('wedding', sub)} lang={lang} t={t} weddingCollections={weddingCollections} weddingVideos={youtubeVideosMap['wedding'] || []} />
                        <InteriorSection onImageClick={(img: ProductCard) => {
                            const list = img.resourceType === 'video' ? (youtubeVideosMap['interior'] || []) : interiorPhotos;
                            openLightbox(list, list.findIndex(p => p.id === img.id));
                        }} onViewAll={() => openAlbumHub('interior')} lang={lang} t={t} customHospitality={interiorPhotos} videos={youtubeVideosMap['interior'] || []} />
                        <ProfileSection onImageClick={(img: ProductCard) => {
                            const list = img.resourceType === 'video' ? (youtubeVideosMap['profile'] || []) : profilePhotos;
                            openLightbox(list, list.findIndex(p => p.id === img.id));
                        }} onViewAll={() => openAlbumHub('profile')} lang={lang} t={t} photos={profilePhotos} videos={youtubeVideosMap['profile'] || []} />
                        <EventSection onImageClick={(img: ProductCard) => {
                            const list = img.resourceType === 'video' ? (youtubeVideosMap['event'] || []) : eventPhotos;
                            openLightbox(list, list.findIndex(p => p.id === img.id));
                        }} onViewAll={() => openAlbumHub('event')} lang={lang} t={t} customEventPhotos={eventPhotos} videos={youtubeVideosMap['event'] || []} />
                        <RealEstateSection onImageClick={(img: ProductCard) => {
                            const list = img.resourceType === 'video' ? getRealEstateVideoList : realEstatePhotos;
                            openLightbox(list, list.findIndex(p => p.id === img.id));
                        }} onViewAll={() => openAlbumHub('real_estate')} lang={lang} t={t} videos={getRealEstateVideoList} photos={realEstatePhotos} />
                        <CommercialSection onImageClick={(img: ProductCard) => {
                            const list = img.resourceType === 'video' ? (youtubeVideosMap['commercial'] || []) : commercialPhotos;
                            openLightbox(list, list.findIndex(p => p.id === img.id));
                        }} onViewAll={() => openAlbumHub('commercial')} lang={lang} t={t} photos={commercialPhotos} videos={youtubeVideosMap['commercial'] || []} />
                        <LifestyleSection onImageClick={(img: ProductCard) => {
                            const list = img.resourceType === 'video' ? (youtubeVideosMap['lifestyle'] || []) : lifestylePhotos;
                            openLightbox(list, list.findIndex(p => p.id === img.id));
                        }} onViewAll={() => openAlbumHub('lifestyle')} lang={lang} t={t} photos={lifestylePhotos} videos={youtubeVideosMap['lifestyle'] || []} />
                        <ProcessSection lang={lang} t={t} />
                        <section id="studio" className="relative h-[40vh] bg-black flex items-center justify-center">
                            <div className="absolute inset-0 opacity-40">
                                {UI_ASSETS.CONTACT_BG && (
                                    <img src={getOptimizedUrl(UI_ASSETS.CONTACT_BG, 'full')} className="w-full h-full object-cover" alt="BigBee Studio Contact" loading="lazy" decoding="async" />
                                )}
                            </div>
                            <div className="relative z-10 text-center px-6">
                                <h2 className="text-4xl md:text-8xl font-black text-white uppercase mb-8 tracking-tighter">{t.studio_title || "BIGBEE STUDIO"}</h2>
                                <a href={t.link_contact_action} className="bg-white text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl inline-block rounded-[6px]">{t.studio_section_cta}</a>
                            </div>
                        </section>
                    </>
                ) : (
                    <GalleryPage 
                        initialAlbumKey={initialAlbumKey} initialSubKey={initialSubKey} onBack={() => setView('home')} 
                        onImageClick={(img, items) => openLightbox(items, items.findIndex(p => p.id === img.id))} 
                        lang={lang} t={t}
                        dynamicFood={foodPhotos} dynamicFoodVideos={youtubeVideosMap['food'] || []} dynamicSports={sportsPhotos} dynamicSportsVideos={youtubeVideosMap['sports'] || []} dynamicHospitality={interiorPhotos} dynamicHospitalityVideos={youtubeVideosMap['interior'] || []}
                        dynamicEvents={eventPhotos} dynamicEventsVideos={youtubeVideosMap['event'] || []} dynamicProfile={profilePhotos} dynamicProfileVideos={youtubeVideosMap['profile'] || []} dynamicRealEstateVideos={getRealEstateVideoList} dynamicRealEstatePhotos={realEstatePhotos}
                        dynamicCommercial={commercialPhotos} dynamicCommercialVideos={youtubeVideosMap['commercial'] || []} dynamicLifestyle={lifestylePhotos} dynamicLifestyleVideos={youtubeVideosMap['lifestyle'] || []} weddingCollections={weddingCollections} 
                        weddingVideos={youtubeVideosMap['wedding'] || []}
                    />
                )}
            </main>
            <Footer lang={lang} t={t} />
            {lightbox && <Lightbox key="global-lightbox" items={lightbox.items} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />}
        </div>
    );
};

export default App;