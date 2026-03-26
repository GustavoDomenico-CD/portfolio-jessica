import { setupLoadingScreen } from './modules/loader';
import { setupCustomCursor } from './modules/cursor';
import { setupScrollProgress, setupStaggeredReveals } from './modules/scrollEffects';
import { setupMagneticButtons } from './modules/tilt';
import { setupSkillBars, setupCounters } from './modules/counters';
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
  setupSkillBars();
  setupCounters();

  initTypeWriter();

  setupVideoLazyLoading();
  setupMediaHoverEffects();

  setupBackToTopButton();
  updateCopyrightYear();
  setupCertificationToggles();
  setupProjectFilter();
  setupOfflineBanner();

  registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', boot);
