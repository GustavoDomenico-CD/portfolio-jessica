// ─── Loading Screen ───────────────────────────────────────────────────────────

const TOTAL_DURATION = 15000;

export function setupLoadingScreen(): Promise<void> {
  return new Promise((resolve) => {
    const loader = document.getElementById('loading-screen');
    if (!loader) { resolve(); return; }

    const fill        = loader.querySelector<HTMLElement>('.loader-bar-fill');
    const taglineEl   = loader.querySelector<HTMLElement>('.loader-tagline');
    const percentEl   = loader.querySelector<HTMLElement>('.loader-percent');
    const dotsEl      = loader.querySelector<HTMLElement>('.loader-dots');

    const start = performance.now();

    const progressRAF = (now: number): void => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / TOTAL_DURATION, 1);
      const eased = raw < 0.5
        ? 4 * raw * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      const pct = Math.floor(eased * 100);
      if (fill)      fill.style.width = `${pct}%`;
      if (percentEl) percentEl.textContent = `${pct}%`;

      if (raw < 1) requestAnimationFrame(progressRAF);
    };
    requestAnimationFrame(progressRAF);

    // Initials appear at 0.5s (CSS animation), full name reveals at 2s
    const nameEl = loader.querySelector<HTMLElement>('.loader-name');
    setTimeout(() => {
      if (nameEl) nameEl.classList.add('name-revealed');
    }, 2000);

    setTimeout(() => {
      if (taglineEl) taglineEl.classList.add('loader-tagline--visible');
    }, 5000);

    const phases = [
      'Inicializando...',
      'Carregando experiências...',
      'Preparando conteúdo...',
      'Quase lá...',
      'Bem-vindo.',
    ];
    const phaseInterval = (TOTAL_DURATION - 2000) / phases.length;
    phases.forEach((phase, i) => {
      setTimeout(() => {
        if (dotsEl) {
          dotsEl.style.opacity = '0';
          setTimeout(() => {
            if (dotsEl) {
              dotsEl.textContent = phase;
              dotsEl.style.opacity = '1';
            }
          }, 200);
        }
      }, 1500 + i * phaseInterval);
    });

    setTimeout(() => {
      if (fill)      fill.style.width = '100%';
      if (percentEl) percentEl.textContent = '100%';

      setTimeout(() => {
        loader.classList.add('loader--done');
        setTimeout(() => {
          loader.remove();
          document.body.classList.add('page-loaded');
          resolve();
        }, 700);
      }, 400);
    }, TOTAL_DURATION);
  });
}
