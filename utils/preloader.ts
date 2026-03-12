import { ImageCache } from './imageCache';

/**
 * Utility to preload images in the background
 */
export const preloadImage = (url: string, priority: 'auto' | 'high' | 'low' = 'auto'): Promise<void> => {
    if (ImageCache.isLoaded(url)) return Promise.resolve();

    if ('fetch' in window && priority === 'low') {
        return fetch(url, { priority: 'low', mode: 'no-cors' })
            .then(() => {
                ImageCache.markLoaded(url);
            })
            .catch(() => {});
    }
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            ImageCache.markLoaded(url);
            resolve();
        };
        img.onerror = () => reject();
    });
};

/**
 * Preload a list of images with concurrency control
 */
export const preloadImages = async (urls: string[], concurrency: number = 4, priority: 'auto' | 'high' | 'low' = 'auto') => {
    const queue = [...urls];
    const workers = Array(concurrency).fill(null).map(async () => {
        while (queue.length > 0) {
            const url = queue.shift();
            if (url) {
                try {
                    await preloadImage(url, priority);
                } catch (e) {
                    console.warn(`Failed to preload: ${url}`);
                }
            }
        }
    });
    await Promise.all(workers);
};
