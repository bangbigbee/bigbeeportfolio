
import React from 'react';

export type Language = 'vi' | 'en';

export interface ProductCard {
    id: string;
    category: string;
    title: string;
    subtitle: string;
    price?: string;
    imageUrl: string;
    videoUrl?: string;
    youtubeId?: string; 
    resourceType?: 'image' | 'video';
    badge?: string;
    size?: 'small' | 'large' | 'tall' | 'wide';
    aspectRatio?: string;
    width?: number;
    height?: number;
}

export interface NavItem {
    label: string;
    href: string;
}

export interface ProcessStep {
    title: string;
    description: string;
    icon: React.ReactNode;
}
