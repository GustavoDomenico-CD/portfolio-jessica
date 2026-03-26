/* src/modules/aiOrb.ts
   3-D neural-network orb — Propósito & Valores section */

interface Node3D {
  x: number; y: number; z: number;
  r: number;
  phase: number;
}

const GREEN = '0, 164, 67';
const NODES = 48;
const SPHERE_R = 95;
const CONNECT_DIST = 58;

function fibSphere(count: number, radius: number): Node3D[] {
  const nodes: Node3D[] = [];
  const goldenAngle = Math.PI * (1 + Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / count);
    const theta = goldenAngle * i;
    nodes.push({
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
      r: 1.4 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return nodes;
}

function rotY(x: number, z: number, a: number) {
  return { x: x * Math.cos(a) - z * Math.sin(a), z: x * Math.sin(a) + z * Math.cos(a) };
}
function rotX(y: number, z: number, a: number) {
  return { y: y * Math.cos(a) - z * Math.sin(a), z: y * Math.sin(a) + z * Math.cos(a) };
}
function project(x: number, y: number, z: number, cx: number, cy: number) {
  const fov = 340;
  const d = fov / (fov + z);
  return { sx: cx + x * d, sy: cy + y * d, d };
}

export function setupAIOrb(): void {
  const canvas = document.getElementById('ai-orb-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const nodes = fibSphere(NODES, SPHERE_R);
  let angleY = 0;
  const TILT_X = 0.22;
  let t = 0;
  let rafId = 0;

  function resize() {
    const parent = canvas!.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    canvas!.width = w;
    canvas!.height = Math.min(300, Math.max(200, w * 0.38));
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function frame() {
    t += 0.007;
    angleY += 0.0035;

    const W = canvas!.width;
    const H = canvas!.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx!.clearRect(0, 0, W, H);

    const pts = nodes.map(n => {
      const ry = rotY(n.x, n.z, angleY);
      const rx = rotX(n.y, ry.z, TILT_X);
      return { p: project(ry.x, rx.y, rx.z, cx, cy), n };
    });

    for (let i = 0; i < NODES; i++) {
      for (let j = i + 1; j < NODES; j++) {
        const ni = nodes[i], nj = nodes[j];
        if (!ni || !nj) continue;
        const dx = ni.x - nj.x, dy = ni.y - nj.y, dz = ni.z - nj.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist >= CONNECT_DIST) continue;
        const pti = pts[i], ptj = pts[j];
        if (!pti || !ptj) continue;
        const { p: pi } = pti;
        const { p: pj } = ptj;
        const avgD = (pi.d + pj.d) * 0.5;
        const alpha = (1 - dist / CONNECT_DIST) * 0.3 * avgD;
        ctx!.beginPath();
        ctx!.moveTo(pi.sx, pi.sy);
        ctx!.lineTo(pj.sx, pj.sy);
        ctx!.strokeStyle = `rgba(${GREEN}, ${alpha})`;
        ctx!.lineWidth = 0.55 * avgD;
        ctx!.stroke();
      }
    }

    pts.sort((a, b) => a.p.d - b.p.d);
    for (const { p, n } of pts) {
      const pulse = 0.65 + 0.35 * Math.sin(t * 1.8 + n.phase);
      const r = Math.max(n.r * p.d * pulse, 0.4);
      const alpha = 0.35 + 0.65 * p.d;

      const grd = ctx!.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 5);
      grd.addColorStop(0, `rgba(${GREEN}, ${alpha * 0.28})`);
      grd.addColorStop(1, `rgba(${GREEN}, 0)`);
      ctx!.beginPath();
      ctx!.arc(p.sx, p.sy, r * 5, 0, Math.PI * 2);
      ctx!.fillStyle = grd;
      ctx!.fill();

      ctx!.beginPath();
      ctx!.arc(p.sx, p.sy, r, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${GREEN}, ${alpha})`;
      ctx!.fill();
    }

    rafId = requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver(entries => {
    const entry = entries[0];
    if (!entry) return;
    if (entry.isIntersecting) {
      rafId = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(rafId);
    }
  }, { threshold: 0.05 });
  io.observe(canvas);
}
