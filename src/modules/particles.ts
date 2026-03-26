// ─── Floating Particles Background ───────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  opacityDelta: number;
}

export function setupParticles(): void {
  const canvas = document.createElement('canvas');
  canvas.className = 'particles-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const PARTICLE_COUNT = 55;
  const COLOR = '0, 164, 67'; // green rgb
  let particles: Particle[] = [];
  let mouseX = -9999;
  let mouseY = -9999;
  let animId: number;

  const resize = (): void => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createParticle = (): Particle => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.04,
    opacityDelta: (Math.random() - 0.5) * 0.002,
  });

  const init = (): void => {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  };

  const drawConnections = (): void => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i]!.x - particles[j]!.x;
        const dy = particles[i]!.y - particles[j]!.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const opacity = (1 - dist / 130) * 0.10;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${COLOR}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i]!.x, particles[i]!.y);
          ctx.lineTo(particles[j]!.x, particles[j]!.y);
          ctx.stroke();
        }
      }

      const dx = particles[i]!.x - mouseX;
      const dy = particles[i]!.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const opacity = (1 - dist / 180) * 0.20;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${COLOR}, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(particles[i]!.x, particles[i]!.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    }
  };

  const tick = (): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.vx += (dx / dist) * 0.04;
        p.vy += (dy / dist) * 0.04;
      }

      p.vx *= 0.995;
      p.vy *= 0.995;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }

      p.opacity += p.opacityDelta;
      if (p.opacity > 0.4 || p.opacity < 0.02) p.opacityDelta *= -1;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, ${p.opacity})`;
      ctx.fill();
    });

    drawConnections();
    animId = requestAnimationFrame(tick);
  };

  init();
  tick();

  window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); tick(); });
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });
}
