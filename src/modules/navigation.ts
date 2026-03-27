// ─── Tab Navigation ──────────────────────────────────────────────────────────

function getTabName(href: string): string {
  if (!href || href === '#') return 'home';
  return href.replace('#', '');
}

export function switchTab(tabName: string): void {
  const panels = document.querySelectorAll<HTMLElement>('.tab-panel');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-tab]');

  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset['tabPanel'] === tabName);
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset['tab'] === tabName);
  });

  // Update URL hash
  const hash = tabName === 'home' ? '' : `#${tabName}`;
  history.pushState(null, '', hash || window.location.pathname);

  // Scroll to top of main content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Active Nav Link ──────────────────────────────────────────────────────────

export function setActiveNavLink(id: string | null = null): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-tab]');

  if (id) {
    const tabName = getTabName(id);
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset['tab'] === tabName);
    });
  }
}

// ─── Smooth Scrolling / Tab Switching ─────────────────────────────────────────

export function setupSmoothScrolling(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-tab]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = anchor.dataset['tab'];
      if (tabName) switchTab(tabName);
    });
  });

  // Handle initial hash on page load
  const hash = window.location.hash;
  if (hash) {
    const tabName = getTabName(hash);
    switchTab(tabName);
  }

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    const tabName = getTabName(window.location.hash);
    switchTab(tabName);
  });
}

// ─── Side Nav ─────────────────────────────────────────────────────────────────

export function setupSideNav(): void {
  document.querySelectorAll<HTMLAnchorElement>('.side-nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) {
        const tabName = getTabName(href);
        switchTab(tabName);
      }
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

// ─── Scroll-based Active Link Update (no-op for tabs) ────────────────────────

export function setupScrollActiveLink(): void {
  // No longer needed — tab navigation handles active state
}

// ─── Resize Handler ───────────────────────────────────────────────────────────

export function setupResizeHandler(): void {
  // No longer needed — tabs don't require scroll offset recalculation
}

// ─── Timeline Expandable Items ────────────────────────────────────────────────

export function setupTimelineToggles(): void {
  const headers = document.querySelectorAll<HTMLElement>('.timeline-header');

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const details = header.nextElementSibling as HTMLElement | null;

      // Close all other open items
      headers.forEach((other) => {
        if (other !== header) {
          other.setAttribute('aria-expanded', 'false');
          (other.nextElementSibling as HTMLElement | null)?.classList.remove('open');
        }
      });

      // Toggle current
      header.setAttribute('aria-expanded', String(!isExpanded));
      details?.classList.toggle('open', !isExpanded);
    });

    // Keyboard support
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}
