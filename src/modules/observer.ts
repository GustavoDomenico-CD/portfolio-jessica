import type { ObserverConfig } from '../types';

// ─── Section / Element Reveal ─────────────────────────────────────────────────

export function setupIntersectionObserver(): void {
  const config: ObserverConfig = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  if (!('IntersectionObserver' in window)) {
    document
      .querySelectorAll<HTMLElement>('.section, .profile-image, .contact-item')
      .forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = entry.target as HTMLElement;
      target.classList.add('visible');

      if (target.dataset['observe'] !== 'multiple') {
        observer.unobserve(target);
      }
    });
  }, config);

  const selectors =
    '.section, .profile-image, .contact-item, .skill-item, .project-card';

  document.querySelectorAll<HTMLElement>(selectors).forEach((el) => observer.observe(el));
}

// ─── Lazy Image Loading ───────────────────────────────────────────────────────

export function lazyLoadImages(): void {
  const lazyMedia = document.querySelectorAll<HTMLImageElement>('img.lazy');

  if (!('IntersectionObserver' in window)) {
    lazyMedia.forEach((img) => {
      if (img.dataset['src']) img.src = img.dataset['src'];
      img.classList.add('loaded');
    });
    return;
  }

  const mediaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target as HTMLImageElement;

        if (img.dataset['src']) img.src = img.dataset['src'];
        if (img.dataset['srcset']) img.srcset = img.dataset['srcset'];

        img.classList.remove('lazy');
        img.classList.add('loaded');
        mediaObserver.unobserve(img);
      });
    },
    { threshold: 0.1 }
  );

  lazyMedia.forEach((img) => mediaObserver.observe(img));
}

// ─── Project Media Intersection ───────────────────────────────────────────────

export function setupProjectMediaIntersection(): void {
  const mediaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        mediaObserver.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  document
    .querySelectorAll<HTMLElement>('.project-media')
    .forEach((media) => mediaObserver.observe(media));
}
