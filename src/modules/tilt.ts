// ─── 3D Tilt on Cards ─────────────────────────────────────────────────────────

export function setupTiltEffect(): void {
  if ('ontouchstart' in window) return;

  const cards = document.querySelectorAll<HTMLElement>('.project-card, .skill-item');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;

      card.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(6px)
      `;

      const glare = card.querySelector<HTMLElement>('.card-glare');
      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0,164,67,0.10) 0%, transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const glare = card.querySelector<HTMLElement>('.card-glare');
      if (glare) glare.style.background = '';
    });

    const glare = document.createElement('div');
    glare.className = 'card-glare';
    card.appendChild(glare);
  });
}

// ─── Magnetic Buttons ─────────────────────────────────────────────────────────

export function setupMagneticButtons(): void {
  if ('ontouchstart' in window) return;

  const magnetics = document.querySelectorAll<HTMLElement>(
    '.project-link, #backToTop, .contact-icon'
  );

  magnetics.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;

      btn.style.transform = `translate(${dx}px, ${dy}px)`;
      btn.style.transition = 'transform 0.1s ease';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}
