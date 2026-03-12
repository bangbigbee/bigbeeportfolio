
const loadedUrls = new Set<string>();

/**
 * Global cache to track images that have already been loaded in the current session.
 * This helps avoid redundant network calls and "flickering" when navigating back to 
 * previously viewed images.
 */
export const ImageCache = {
    markLoaded: (url: string) => {
        if (url) loadedUrls.add(url);
    },
    isLoaded: (url: string) => {
        return url ? loadedUrls.has(url) : false;
    },
    clear: () => {
        loadedUrls.clear();
    }
};
