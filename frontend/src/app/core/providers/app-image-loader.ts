import { IMAGE_LOADER, ImageLoaderConfig } from "@angular/common";

/**
 * Factory function that returns an IMAGE_LOADER implementation for Cloudflare Images.
 * @param cloudflareAccountHash - Cloudflare Images account hash
 * @returns The loader function for NgOptimizedImage
 */
const appImageLoader = (cloudflareAccountHash: string) => {
  return (config: ImageLoaderConfig) => {
    const { src, width } = config;

    // 1. Handle external URLs and local assets (Bypass Cloudflare)
    if (src.startsWith('http') || src.includes("assets/")) {
      return src;
    }

    // 2. Extract the Image ID
    // ngSrc="my-image-id", so this is simple.
    const imageId = src;

    // 3. Build the Optimized URL
    // 'public' is the base variant, then layer flexible overrides
    const params = [
      `w=${width ?? 256}`,
      'format=auto',
      'quality=85'
    ].filter(Boolean).join('&');

    return `https://imagedelivery.net/${cloudflareAccountHash}/${imageId}/public?${params}`;
  }
};

export const provideAppImageLoader = (cloudflareAccountHash: string) => ({
  provide: IMAGE_LOADER,
  useFactory: () => appImageLoader(cloudflareAccountHash),
});
