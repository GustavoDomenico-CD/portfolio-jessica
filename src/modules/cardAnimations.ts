/* src/modules/cardAnimations.ts
   Expandable 3D card animations — Propósito & Valores section.
   Cards: transformacao · impacto · humanizacao · inovacao
*/

const GREEN = '0, 164, 67';

type P3 = [number, number, number];
type Edge = [number, number];

function project(x: number, y: number, z: number, cx: number, cy: number) {
  const fov = 220;
  const d = fov / (fov + z);
  return { sx: cx + x * d, sy: cy + y * d, d };
}

function rotY([x, y, z]: P3, a: number): P3 {
  return [x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a)];
}

function rotX([x, y, z]: P3, a: number): P3 {
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  verts: P3[],
  edges: Edge[],
  angleY: number,
  tiltX: number,
  cx: number,
  cy: number,
  t: number,
): void {
  const pts = verts.map(v => {
    const ry = rotY(v, angleY);
    const rx = rotX(ry, tiltX);
    return project(rx[0], rx[1], rx[2], cx, cy);
  });

  for (const [i, j] of edges) {
    const a = pts[i];
    const b = pts[j];
    if (!a || !b) continue;
    const alpha = (a.d + b.d) * 0.5 * 0.55;
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.strokeStyle = `rgba(${GREEN}, ${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  for (const pt of pts) {
    const pulse = 0.7 + 0.3 * Math.sin(t * 2 + pt.sx * 0.05);
    const r = Math.max(2.2 * pt.d * pulse, 0.5);
    const grd = ctx.createRadialGradient(pt.sx, pt.sy, 0, pt.sx, pt.sy, r * 4.5);
    grd.addColorStop(0, `rgba(${GREEN}, ${pt.d * 0.25})`);
    grd.addColorStop(1, `rgba(${GREEN}, 0)`);
    ctx.beginPath();
    ctx.arc(pt.sx, pt.sy, r * 4.5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pt.sx, pt.sy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${GREEN}, ${pt.d * 0.85})`;
    ctx.fill();
  }
}

function makeOctahedron(r: number): { verts: P3[]; edges: Edge[] } {
  return {
    verts: [[0, -r, 0], [0, r, 0], [-r, 0, 0], [r, 0, 0], [0, 0, -r], [0, 0, r]],
    edges: [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [4, 3], [3, 5], [5, 2]],
  };
}

function makeCube(r: number): { verts: P3[]; edges: Edge[] } {
  return {
    verts: [
      [-r, -r, -r], [r, -r, -r], [r, r, -r], [-r, r, -r],
      [-r, -r,  r], [r, -r,  r], [r, r,  r], [-r, r,  r],
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ],
  };
}

function makeIcosahedron(r: number): { verts: P3[]; edges: Edge[] } {
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = r / Math.sqrt(1 + phi * phi);
  const b = phi * a;
  const verts: P3[] = [
    [0, a, b], [0, -a, b], [0, a, -b], [0, -a, -b],
    [a, b, 0], [-a, b, 0], [a, -b, 0], [-a, -b, 0],
    [b, 0, a], [-b, 0, a], [b, 0, -a], [-b, 0, -a],
  ];
  const edges: Edge[] = [
    [0, 1], [0, 4], [0, 5], [0, 8], [0, 9],
    [1, 6], [1, 7], [1, 8], [1, 9],
    [2, 3], [2, 4], [2, 5], [2, 10], [2, 11],
    [3, 6], [3, 7], [3, 10], [3, 11],
    [4, 8], [4, 10], [5, 9], [5, 11],
    [6, 8], [6, 10], [7, 9], [7, 11],
    [8, 9], [10, 11],
  ];
  return { verts, edges };
}

function makeHexPrism(r: number, h: number): { verts: P3[]; edges: Edge[] } {
  const verts: P3[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    verts.push([r * Math.cos(a), -h, r * Math.sin(a)]);
  }
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    verts.push([r * Math.cos(a), h, r * Math.sin(a)]);
  }
  const edges: Edge[] = [];
  for (let i = 0; i < 6; i++) edges.push([i, (i + 1) % 6]);
  for (let i = 0; i < 6; i++) edges.push([6 + i, 6 + ((i + 1) % 6)]);
  for (let i = 0; i < 6; i++) edges.push([i, 6 + i]);
  return { verts, edges };
}

type CardKey = 'transformacao' | 'impacto' | 'humanizacao' | 'inovacao';

function getShape(key: CardKey) {
  switch (key) {
    case 'transformacao': return makeOctahedron(52);
    case 'impacto':       return makeCube(46);
    case 'humanizacao':   return makeIcosahedron(52);
    case 'inovacao':      return makeHexPrism(46, 36);
  }
}

const running = new Map<CardKey, () => void>();

function startAnim(canvas: HTMLCanvasElement, key: CardKey): void {
  if (running.has(key)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const shape = getShape(key);
  const state = { angleY: 0, t: 0, rafId: 0, alive: true };

  function resize() {
    const w = canvas.parentElement?.clientWidth ?? 220;
    canvas.width = w;
    canvas.height = 150;
  }
  resize();

  function frame() {
    if (!state.alive) return;
    state.t += 0.008;
    state.angleY += 0.004;
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    drawShape(ctx!, shape.verts, shape.edges, state.angleY, 0.28, canvas.width / 2, canvas.height / 2, state.t);
    state.rafId = requestAnimationFrame(frame);
  }

  state.rafId = requestAnimationFrame(frame);
  running.set(key, () => {
    state.alive = false;
    cancelAnimationFrame(state.rafId);
  });
}

function stopAnim(key: CardKey): void {
  running.get(key)?.();
  running.delete(key);
}

export function setupCardAnimations(): void {
  const cards = document.querySelectorAll<HTMLElement>('.ai-ethics-card[data-card]');

  cards.forEach(card => {
    const key = card.dataset['card'] as CardKey;
    const canvas = card.querySelector<HTMLCanvasElement>('.card-canvas');

    function toggle() {
      const isOpen = card.classList.contains('open');

      cards.forEach(other => {
        if (other !== card && other.classList.contains('open')) {
          other.classList.remove('open');
          other.setAttribute('aria-expanded', 'false');
          stopAnim(other.dataset['card'] as CardKey);
        }
      });

      if (isOpen) {
        card.classList.remove('open');
        card.setAttribute('aria-expanded', 'false');
        stopAnim(key);
      } else {
        card.classList.add('open');
        card.setAttribute('aria-expanded', 'true');
        if (canvas) startAnim(canvas, key);
      }
    }

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}
