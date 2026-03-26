// ─── Glitch Effect ────────────────────────────────────────────────────────────

export function setupGlitchEffect(): void {
  const title = document.querySelector<HTMLElement>('.typing-title');
  if (!title) return;

  const scheduleGlitch = (): void => {
    const delay = Math.random() * 4000 + 4000;
    setTimeout(() => {
      triggerGlitch(title);
      scheduleGlitch();
    }, delay);
  };

  scheduleGlitch();
}

function triggerGlitch(el: HTMLElement): void {
  const originalText = el.textContent ?? '';
  const glitchChars = '▓▒░█▄▀■□◆◇';
  let frame = 0;
  const maxFrames = 6;
  const interval = 60;

  const glitch = setInterval(() => {
    if (frame >= maxFrames) {
      clearInterval(glitch);
      el.textContent = originalText;
      el.style.textShadow = '';
      return;
    }

    const arr = originalText.split('');
    const numGlitch = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numGlitch; i++) {
      const pos = Math.floor(Math.random() * arr.length);
      if (arr[pos] !== ' ') {
        arr[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)] ?? arr[pos]!;
      }
    }

    el.textContent = arr.join('');
    el.style.textShadow = frame % 2 === 0
      ? '2px 0 rgba(0,164,67,0.8), -2px 0 rgba(255,156,26,0.4)'
      : '-2px 0 rgba(13,169,255,0.4), 2px 0 rgba(0,164,67,0.6)';

    frame++;
  }, interval);
}
