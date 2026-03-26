import type { CloudinarySource } from '../types';

// ─── Cloudinary URL Optimization ─────────────────────────────────────────────

function optimizeCloudinaryUrl({ src, isMobile }: CloudinarySource): string {
  if (!src.includes('res.cloudinary.com')) return src;
  const quality = isMobile ? 'q_auto:low' : 'q_auto:good';
  return src.replace('/upload/', `/upload/${quality},f_auto/`);
}

// ─── Video Lazy Loading ───────────────────────────────────────────────────────

export function setupVideoLazyLoading(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>('.video-container video');
  if (!videos.length) return;

  videos.forEach((video) => {
    video.setAttribute('preload', 'metadata');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const isMobile = window.innerWidth < 768;
          video.querySelectorAll<HTMLSourceElement>('source').forEach((source) => {
            source.src = optimizeCloudinaryUrl({ src: source.src, isMobile });
          });

          video.load();
          observer.unobserve(video);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
  });
}

// ─── Media Hover Effects ──────────────────────────────────────────────────────

export function setupMediaHoverEffects(): void {
  const containers = document.querySelectorAll<HTMLElement>(
    '.video-container, .image-container'
  );

  const applyHover = (el: HTMLElement, active: boolean): void => {
    el.style.transform = active ? 'translateY(-3px)' : '';
    el.style.boxShadow = active
      ? '0 8px 25px rgba(0, 164, 67, 0.15)'
      : '0 4px 15px rgba(0, 0, 0, 0.08)';
  };

  containers.forEach((container) => {
    container.addEventListener('mouseenter', () => applyHover(container, true));
    container.addEventListener('mouseleave', () => applyHover(container, false));
  });
}
