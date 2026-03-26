import { setupLoadingScreen } from './modules/loader';
import { setupParticles } from './modules/particles';
import { setupCustomCursor } from './modules/cursor';
import { setupScrollProgress, setupStaggeredReveals } from './modules/scrollEffects';
import { setupTiltEffect, setupMagneticButtons } from './modules/tilt';
import { setupSkillBars, setupCounters } from './modules/counters';
import { setupGlitchEffect } from './modules/glitch';
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
import { setupAIOrb } from './modules/aiOrb';
import { setupCardAnimations } from './modules/cardAnimations';

async function boot(): Promise<void> {
  await setupLoadingScreen();

  setupParticles();
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
  setupTiltEffect();
  setupMagneticButtons();
  setupSkillBars();
  setupCounters();

  initTypeWriter();
  setupGlitchEffect();

  setupVideoLazyLoading();
  setupMediaHoverEffects();

  setupBackToTopButton();
  updateCopyrightYear();
  setupCertificationToggles();
  setupProjectFilter();
  setupOfflineBanner();
  setupAIOrb();
  setupCardAnimations();

  registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', boot);
