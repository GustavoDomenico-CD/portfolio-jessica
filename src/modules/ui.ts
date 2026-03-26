// ─── Back to Top ─────────────────────────────────────────────────────────────

export function setupBackToTopButton(): void {
  const btn = document.getElementById('backToTop') as HTMLButtonElement | null;
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => btn.classList.toggle('show', window.scrollY > 300),
    { passive: true }
  );

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Copyright Year ───────────────────────────────────────────────────────────

export function updateCopyrightYear(): void {
  const el = document.querySelector<HTMLElement>('.current-year');
  if (el) el.textContent = String(new Date().getFullYear());
}

// ─── Certification Toggles ────────────────────────────────────────────────────

export function setupCertificationToggles(): void {
  document.querySelectorAll<HTMLButtonElement>('.toggle-description').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const targetId = btn.getAttribute('aria-controls') ?? '';
      const targetEl = document.getElementById(targetId);

      btn.setAttribute('aria-expanded', String(!isExpanded));

      if (targetEl) {
        targetEl.hidden = isExpanded;
        if (!isExpanded) {
          setTimeout(
            () => targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
            100
          );
        }
      }

      const icon = btn.querySelector<HTMLElement>('i');
      icon?.classList.toggle('fa-chevron-down');
      icon?.classList.toggle('fa-chevron-up');
    });
  });
}

// ─── Offline Message ──────────────────────────────────────────────────────────

function showOfflineMessage(): void {
  const banner = document.createElement('div');
  banner.className = 'offline-message';
  banner.textContent = 'Você está offline. Algumas funcionalidades podem estar limitadas.';
  document.body.appendChild(banner);

  setTimeout(() => {
    banner.classList.add('hide');
    setTimeout(() => banner.remove(), 500);
  }, 3000);
}

export function setupOfflineBanner(): void {
  window.addEventListener('offline', showOfflineMessage);
}

// ─── Project Filter (stub — not used but kept for interface parity) ───────────

export function setupProjectFilter(): void {
  document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset['filter'];
      if (!f) return;
      document.querySelectorAll<HTMLElement>('.project-card').forEach((card) => {
        card.style.display = 'block';
      });
    });
  });
}
