// ─── Hero Name Reveal (Initials → Full Name) ─────────────────────────────────

export function initTypeWriter(): void {
  const titleEl = document.querySelector<HTMLElement>('.typing-title');
  if (!titleEl) return;

  const initials = titleEl.querySelectorAll<HTMLElement>('.name-initial');
  const professionEl = document.querySelector<HTMLElement>('.profession');

  // Step 1: Show initials (with green color)
  setTimeout(() => {
    initials.forEach((el) => el.classList.add('visible'));
  }, 200);

  // Step 2: Reveal full names simultaneously
  setTimeout(() => {
    titleEl.classList.add('name-revealed');

    // Step 3: Show profession after name reveal completes
    setTimeout(() => {
      if (professionEl) professionEl.style.visibility = 'visible';
    }, 900);
  }, 1200);
}
