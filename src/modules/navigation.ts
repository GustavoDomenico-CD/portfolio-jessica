// ─── Active Nav Link ──────────────────────────────────────────────────────────

export function setActiveNavLink(id: string | null = null): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.nav-link, .footer-link, .side-nav-link'
  );

  if (id) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === id);
    });
    return;
  }

  const sections = document.querySelectorAll<HTMLElement>('.section');
  const scrollPosition = window.scrollY + 100;
  let currentSection = '';

  sections.forEach((section) => {
    if (
      scrollPosition >= section.offsetTop &&
      scrollPosition < section.offsetTop + section.offsetHeight
    ) {
      currentSection = `#${section.getAttribute('id') ?? ''}`;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === currentSection);
  });
}

// ─── Smooth Scrolling ─────────────────────────────────────────────────────────

function scrollToSection(targetId: string): void {
  const targetEl = document.querySelector<HTMLElement>(targetId);
  if (!targetEl) return;

  const headerHeight = document.querySelector<HTMLElement>('.header')?.offsetHeight ?? 0;
  window.scrollTo({ top: targetEl.offsetTop - headerHeight, behavior: 'smooth' });
  history.pushState(null, '', targetId);
  setActiveNavLink(targetId);

  setTimeout(() => {
    targetEl.setAttribute('tabindex', '-1');
    targetEl.focus();
    targetEl.removeAttribute('tabindex');
  }, 800);
}

export function setupSmoothScrolling(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href) scrollToSection(href);
    });
  });
}

// ─── Side Nav ─────────────────────────────────────────────────────────────────

export function setupSideNav(): void {
  document.querySelectorAll<HTMLAnchorElement>('.side-nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) scrollToSection(href);
    });
  });
}

// ─── Hamburger Menu ───────────────────────────────────────────────────────────

export function setupHamburgerMenu(): void {
  const hamburgerBtn = document.querySelector<HTMLButtonElement>('.hamburger-btn');
  const navContainer = document.querySelector<HTMLElement>('.nav-container');
  const navOverlay = document.querySelector<HTMLElement>('.nav-overlay');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

  if (!hamburgerBtn || !navContainer) return;

  const closeMenu = (): void => {
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    navContainer.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));
    navContainer.classList.toggle('active');
    navOverlay?.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  navOverlay?.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMenu();
    });
  });
}

// ─── Header Scroll Effect ─────────────────────────────────────────────────────

export function setupHeaderScrollEffect(): void {
  const header = document.querySelector<HTMLElement>('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > 50) {
      header.classList.add('scrolled');
      header.style.transform = current > lastScroll && current > 100 ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      header.classList.remove('scrolled');
      header.style.transform = 'translateY(0)';
    }

    lastScroll = current;
  }, { passive: true });
}

// ─── Scroll-based Active Link Update ─────────────────────────────────────────

export function setupScrollActiveLink(): void {
  let scrollTimer: ReturnType<typeof setTimeout>;

  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => setActiveNavLink(), 100);
  }, { passive: true });
}

// ─── Resize Handler ───────────────────────────────────────────────────────────

export function setupResizeHandler(): void {
  window.addEventListener('resize', () => {
    const hash = window.location.hash;
    if (!hash) return;

    const targetEl = document.querySelector<HTMLElement>(hash);
    if (!targetEl) return;

    const headerHeight = document.querySelector<HTMLElement>('.header')?.offsetHeight ?? 0;
    window.scrollTo({ top: targetEl.offsetTop - headerHeight, behavior: 'auto' });
  });
}
