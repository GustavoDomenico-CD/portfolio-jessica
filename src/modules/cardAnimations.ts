/* src/modules/cardAnimations.ts
   Reveal animations for alternating timeline items
   (Propósito & Formação sections).
*/

export function setupCardAnimations(): void {
  const timelineItems = document.querySelectorAll<HTMLElement>(
    '.purpose-timeline-item, .formation-timeline-item'
  );

  if (timelineItems.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = entry.target as HTMLElement;
          item.classList.add('revealed');
          observer.unobserve(item);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
  );

  timelineItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 150}ms`;
    observer.observe(item);
  });

  // Re-observe unrevealed items when tabs switch (display changes)
  const tabLinks = document.querySelectorAll<HTMLElement>('[data-tab]');
  tabLinks.forEach((link) => {
    link.addEventListener('click', () => {
      // Small delay to allow display:block to apply
      setTimeout(() => {
        timelineItems.forEach((item) => {
          if (!item.classList.contains('revealed')) {
            observer.observe(item);
          }
        });
      }, 50);
    });
  });
}
