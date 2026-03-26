// ─── Animated Counters ────────────────────────────────────────────────────────

function animateCounter(el: HTMLElement, target: number, duration = 1800): void {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function step(now: number): void {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toString();

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toString();
  }

  requestAnimationFrame(step);
}

export function setupCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = parseFloat(el.dataset['count'] ?? '0');
        animateCounter(el, target);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}
