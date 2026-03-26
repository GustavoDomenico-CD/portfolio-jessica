import { setupLoadingScreen } from './modules/loader';
import { setupCustomCursor } from './modules/cursor';
import { setupScrollProgress, setupStaggeredReveals } from './modules/scrollEffects';
import { setupMagneticButtons } from './modules/tilt';
import { setupCounters } from './modules/counters';
import { initTypeWriter } from './modules/typewriter';
import { lazyLoadImages, setupProjectMediaIntersection } from './modules/observer';
import {
  setupHamburgerMenu,
  setupSmoothScrolling,
  setupSideNav,
  setupHeaderScrollEffect,
  setupScrollActiveLink,
  setupResizeHandler,
} from './modules/navigation';
import { setupVideoLazyLoading, setupMediaHoverEffects } from './modules/media';
import {
  setupBackToTopButton,
  updateCopyrightYear,
  setupCertificationToggles,
  setupOfflineBanner,
  setupProjectFilter,
} from './modules/ui';
import { registerServiceWorker } from './modules/serviceWorker';

function setupPhotoCarousels(): void {
  const carousels = document.querySelectorAll<HTMLElement>('.project-photos');

  carousels.forEach((container) => {
    const photos = container.querySelectorAll<HTMLElement>('.project-photo');
    const dots = container.querySelectorAll<HTMLElement>('.photo-dot');

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset['index'] ?? '0', 10);

        photos.forEach((photo) => photo.classList.remove('active'));
        dots.forEach((d) => d.classList.remove('active'));

        photos[index]?.classList.add('active');
        dots[index]?.classList.add('active');
      });
    });
  });
}

async function boot(): Promise<void> {
  await setupLoadingScreen();

  setupCustomCursor();

  setupScrollProgress();
  setupSmoothScrolling();
  setupSideNav();
  setupHamburgerMenu();
  setupHeaderScrollEffect();
  setupScrollActiveLink();
  setupResizeHandler();

  setupStaggeredReveals();
  lazyLoadImages();
  setupProjectMediaIntersection();
  setupMagneticButtons();
  setupCounters();

  initTypeWriter();

  setupVideoLazyLoading();
  setupMediaHoverEffects();

  setupBackToTopButton();
  updateCopyrightYear();
  setupCertificationToggles();
  setupProjectFilter();
  setupOfflineBanner();
  setupPhotoCarousels();

  registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', boot);
