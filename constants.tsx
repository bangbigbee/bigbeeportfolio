
import React from 'react';
import { ProductCard, NavItem, Language } from './types';
import { Target, Camera, Edit3, CheckCircle } from 'lucide-react';

export const getNavItems = (lang: Language, t: Record<string, string>): NavItem[] => [
    { label: t.nav_food_beverage, href: '#food-beverage' },
    { label: t.nav_sports, href: '#sports' },
    { label: t.nav_wedding, href: '#wedding' },
    { label: t.nav_interior, href: '#interior' },
    { label: t.nav_profile, href: '#profile' },
    { label: t.nav_event, href: '#event' },
    { label: t.nav_real_estate, href: '#realestate' },
    { label: t.nav_commercial, href: '#commercial' },
    { label: t.nav_lifestyle, href: '#lifestyle' },
];

const createPlaceholder = (category: string, count: number, lang: Language): ProductCard[] => 
    Array.from({ length: count }).map((_, i) => ({
        id: `${category}-${i}`,
        category: category.toUpperCase(),
        title: `${category} Series #${i + 1}`,
        subtitle: lang === 'vi' ? 'Lưu trữ cao cấp' : 'Premium Archive',
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?auto=format&fit=crop&q=80&w=1200`
    }));

export const getFoodPhotos = (lang: Language) => createPlaceholder('gastronomy', 12, lang);
export const getCulinaryMenuPhotos = (lang: Language) => createPlaceholder('beverage', 8, lang);
export const getInteriorPhotos = (lang: Language) => createPlaceholder('interior', 10, lang);
export const getEventPhotos = (lang: Language) => createPlaceholder('event', 10, lang);
export const getWeddingPhotos = (lang: Language) => createPlaceholder('wedding', 10, lang);
export const getSportsPhotos = (lang: Language) => createPlaceholder('sports', 10, lang);
export const getProfilePhotos = (lang: Language) => createPlaceholder('profile', 8, lang);
export const getRealEstatePhotos = (lang: Language) => createPlaceholder('realestate', 8, lang);
export const getCommercialPhotos = (lang: Language) => createPlaceholder('commercial', 8, lang);
export const getLifestylePhotos = (lang: Language) => createPlaceholder('lifestyle', 8, lang);

export const getProcessSteps = (lang: Language, t: Record<string, string>) => [
    { title: lang === 'vi' ? 'Tầm nhìn' : 'Vision', description: lang === 'vi' ? 'Đồng điệu với câu chuyện.' : 'Aligning with story.', icon: <Target className="w-8 h-8" /> },
    { title: lang === 'vi' ? 'Ghi ảnh' : 'Capture', description: lang === 'vi' ? 'Làm chủ ánh sáng.' : 'Mastery of light.', icon: <Camera className="w-8 h-8" /> },
    { title: lang === 'vi' ? 'Tinh chỉnh' : 'Refine', description: lang === 'vi' ? 'Hậu kỳ đẳng cấp.' : 'High-end post.', icon: <Edit3 className="w-8 h-8" /> },
    { title: lang === 'vi' ? 'Bàn giao' : 'Deliver', description: lang === 'vi' ? 'Nâng tầm giá trị.' : 'Elevate value.', icon: <CheckCircle className="w-8 h-8" /> },
];

export const getInteriorSubCategory = (lang: Language, type: string): ProductCard[] => createPlaceholder(`interior-${type}`, 6, lang);
