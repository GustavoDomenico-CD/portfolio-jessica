// ─── Custom Cursor with Green Trail ──────────────────────────────────────────

export function setupCustomCursor(): void {
  if ('ontouchstart' in window) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor-dot';

  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';

  document.body.appendChild(cursor);
  document.body.appendChild(cursorRing);

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  let isVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      cursor.style.opacity = '1';
      cursorRing.style.opacity = '1';
      isVisible = true;
    }

    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    spawnTrail(mouseX, mouseY);
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorRing.style.opacity = '0';
    isVisible = false;
  });

  function animateRing(): void {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactables = 'a, button, .project-card, .skill-item, .contact-item, .project-link';
  document.querySelectorAll<HTMLElement>(interactables).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-ring--hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-ring--hover'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('cursor-dot--click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('cursor-dot--click'));
}

// ─── Particle Trail ───────────────────────────────────────────────────────────

let lastTrailTime = 0;

function spawnTrail(x: number, y: number): void {
  const now = Date.now();
  if (now - lastTrailTime < 40) return;
  lastTrailTime = now;

  const particle = document.createElement('span');
  particle.className = 'cursor-trail';

  const size = Math.random() * 5 + 3;
  const offsetX = (Math.random() - 0.5) * 12;
  const offsetY = (Math.random() - 0.5) * 12;

  particle.style.cssText = `
    left: ${x + offsetX}px;
    top: ${y + offsetY}px;
    width: ${size}px;
    height: ${size}px;
  `;

  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 600);
}
