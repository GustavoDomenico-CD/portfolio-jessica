import type { TypeWriterOptions } from '../types';

function typeWriter(
  element: HTMLElement,
  text: string,
  { speed = 100, onComplete = () => {} }: TypeWriterOptions = {}
): void {
  let i = 0;
  element.textContent = '';

  function typing(): void {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else {
      onComplete();
    }
  }

  typing();
}

export function initTypeWriter(): void {
  const titleEl = document.querySelector<HTMLElement>('.typing-title');
  if (!titleEl) return;

  const text = titleEl.textContent ?? '';

  typeWriter(titleEl, text, {
    speed: 80,
    onComplete: () => {
      const professionEl = document.querySelector<HTMLElement>('.profession');
      if (professionEl) professionEl.style.visibility = 'visible';
    },
  });
}
