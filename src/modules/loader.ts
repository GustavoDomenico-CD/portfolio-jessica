// ─── Loading Screen ───────────────────────────────────────────────────────────

const TOTAL_DURATION = 15000;

function loaderTypeWriter(el: HTMLElement, text: string, duration: number): Promise<void> {
  return new Promise((resolve) => {
    el.textContent = '';
    const charDelay = duration / text.length;
    let i = 0;

    const tick = (): void => {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(tick, charDelay);
      } else {
        resolve();
      }
    };

    tick();
  });
}

export function setupLoadingScreen(): Promise<void> {
  return new Promise((resolve) => {
    const loader = document.getElementById('loading-screen');
    if (!loader) { resolve(); return; }

    const fill        = loader.querySelector<HTMLElement>('.loader-bar-fill');
    const initialsEl  = loader.querySelector<HTMLElement>('.loader-initials');
    const restJ       = loader.querySelector<HTMLElement>('.loader-rest--j');
    const restF       = loader.querySelector<HTMLElement>('.loader-rest--f');
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

    // Phase 1: Show initials "J" and "F" with dramatic entrance (0ms)
    // Initials are already in HTML, CSS handles the entrance animation

    // Phase 2: After initials are shown, shrink them and type remaining letters (1800ms)
    setTimeout(() => {
      if (initialsEl) {
        initialsEl.classList.add('loader-initials--expand');
        initialsEl.classList.add('loader-initials--typing');
      }
      // After shrink transition, type the remaining letters
      setTimeout(async () => {
        if (restJ) await loaderTypeWriter(restJ, 'ESSICA', 800);
        if (restF) await loaderTypeWriter(restF, 'ERRARO', 800);
        if (initialsEl) initialsEl.classList.remove('loader-initials--typing');
      }, 600);
    }, 1800);

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
