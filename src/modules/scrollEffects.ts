// ─── Scroll Progress Bar ─────────────────────────────────────────────────────

export function setupScrollProgress(): void {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

// ─── Staggered Reveal by direction ───────────────────────────────────────────

type RevealDirection = 'up' | 'left' | 'right' | 'fade';

function getRevealTransform(dir: RevealDirection): string {
  switch (dir) {
    case 'up':    return 'translateY(40px)';
    case 'left':  return 'translateX(-40px)';
    case 'right': return 'translateX(40px)';
    case 'fade':  return 'scale(0.95)';
  }
}

export function setupStaggeredReveals(): void {
  const groups: { selector: string; dir: RevealDirection; stagger: number }[] = [
    { selector: '.skill-item',         dir: 'up',    stagger: 80  },
    { selector: '.project-card',       dir: 'up',    stagger: 120 },
    { selector: '.software-card',      dir: 'up',    stagger: 120 },
    { selector: '.contact-item',       dir: 'up',    stagger: 100 },
    { selector: '.certification-card', dir: 'fade',  stagger: 90  },
    { selector: '.section',            dir: 'up',    stagger: 0   },
  ];

  groups.forEach(({ selector, dir, stagger }) => {
    const elements = document.querySelectorAll<HTMLElement>(selector);

    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = getRevealTransform(dir);
      el.style.transition = `opacity 0.65s ease ${i * stagger}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${i * stagger}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.opacity = '1';
            target.style.transform = 'none';
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  });
}
