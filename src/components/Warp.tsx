import { useEffect, useRef } from 'react';

/**
 * v3.0 · پس‌زمینه‌ی «تونل»: یه کرم‌چاله‌ی زنده پشت دکمه‌ی اتصال.
 * idle: آروم شناوره · connecting: پرش به سرعت نور · connected: کروز با سرعتی که به ترافیک واقعی وصله
 */
type Props = {
  status: 'idle' | 'connecting' | 'connected';
  a1: string; a2: string; st: string;
  /** بایت بر ثانیه، سرعت تونل رو زیاد می‌کنه */
  traffic?: number;
  reduce?: boolean;
  /** سلکتور المانی که نقطه‌ی گریز تونل روشه */
  anchor?: string;
};

const hex = (h: string) => { const n = parseInt(h.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const; };
const rgba = (c: readonly number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
const mix = (a: readonly number[], b: readonly number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);

export default function Warp({ status, a1, a2, st, traffic = 0, reduce, anchor = '.orb' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ status, a1, a2, st, traffic, reduce, anchor });
  live.current = { status, a1, a2, st, traffic, reduce, anchor };

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    let w = 0, h = 0, dpr = 1, raf = 0, t = 0, last = performance.now();
    let vx = 0, vy = 0, tx = 0, ty = 0, speed = 0.002, lastAnchor = 0;
    const N = 340;
    const stars = Array.from({ length: N }, () => ({ a: Math.random() * Math.PI * 2, r: 0.08 + Math.random() * 1.4, z: Math.random(), pz: 0, hue: Math.random() }));
    const rings = Array.from({ length: 9 }, (_, i) => ({ z: i / 9 }));
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();
    vx = tx = w / 2; vy = ty = h / 2;

    const frame = (now: number) => {
      const L = live.current;
      const dt = Math.min(50, now - last) / 16.67; last = now;
      if (document.hidden) { raf = requestAnimationFrame(frame); return; }
      // نقطه‌ی گریز: مرکز دکمه‌ی اتصال (اگه نبود، وسط صفحه)
      if (now - lastAnchor > 400) {
        lastAnchor = now;
        const el = document.querySelector(L.anchor);
        const b = cv.getBoundingClientRect();
        if (el) { const r = el.getBoundingClientRect(); tx = r.left + r.width / 2 - b.left; ty = r.top + r.height / 2 - b.top; }
        else { tx = w / 2; ty = h * 0.46; }
      }
      vx += (tx - vx) * 0.06 * dt; vy += (ty - vy) * 0.06 * dt;
      const mbps = (L.traffic || 0) / 1048576;
      const target = L.reduce ? 0.0006 : L.status === 'connecting' ? 0.03 : L.status === 'connected' ? 0.0045 + Math.min(0.012, mbps * 0.004) : 0.0016;
      speed += (target - speed) * (L.status === 'connecting' ? 0.025 : 0.04) * dt;
      t += dt;

      const c1 = hex(L.a1), c2 = hex(L.a2), cs = hex(L.st);
      const base = L.status === 'connected' ? mix(c1, cs, 0.55) : c1;
      const R = Math.hypot(w, h) * 0.62;
      const wob = L.reduce ? 0 : 1;

      // محو کردن فریم قبلی = دنباله‌ی نور
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = L.status === 'connecting' ? 'rgba(6,5,20,0.28)' : 'rgba(6,5,20,0.42)';
      ctx.fillRect(0, 0, w, h);

      // هسته‌ی نورانی پشت دکمه
      const glow = ctx.createRadialGradient(vx, vy, 0, vx, vy, R * 0.5);
      glow.addColorStop(0, rgba(base, L.status === 'connecting' ? 0.22 : 0.13));
      glow.addColorStop(0.4, rgba(c2, 0.05));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      // حلقه‌های تونل
      for (const g of rings) {
        g.z -= speed * 0.55 * dt;
        if (g.z <= 0.02) g.z += 1;
        const k = 1 - g.z;                 // 0 = دور، 1 = نزدیک
        const rr = (0.04 / Math.max(0.03, g.z)) * R * 0.35;
        if (rr > R * 1.4) continue;
        const ox = Math.sin(t * 0.012 + g.z * 6) * 26 * g.z * wob, oy = Math.cos(t * 0.01 + g.z * 5) * 18 * g.z * wob;
        const a = Math.min(1, k * 1.3) * (1 - Math.min(1, rr / (R * 1.3))) * (L.status === 'connecting' ? 0.55 : 0.28);
        ctx.strokeStyle = rgba(mix(base, c2, g.z), a);
        ctx.lineWidth = 1 + k * 2.2;
        ctx.beginPath(); ctx.ellipse(vx + ox, vy + oy, rr, rr * 0.92, 0, 0, Math.PI * 2); ctx.stroke();
        // پکت‌های روی حلقه وقتی وصلی
        if (L.status === 'connected' && !L.reduce) {
          for (let p = 0; p < 3; p++) {
            const an = t * 0.02 * (p % 2 ? 1 : -1) + p * 2.1 + g.z * 9;
            ctx.fillStyle = rgba(cs, a * 2.2);
            ctx.beginPath(); ctx.arc(vx + ox + Math.cos(an) * rr, vy + oy + Math.sin(an) * rr * 0.92, 1.2 + k * 1.6, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      // ستاره‌ها (با رگه‌ی نور در سرعت بالا)
      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed * dt * (0.6 + s.r * 0.3);
        if (s.z <= 0.01) { s.z = 1; s.pz = 1; s.a = Math.random() * Math.PI * 2; s.r = 0.08 + Math.random() * 1.4; }
        const f = 0.12 / s.z, pf = 0.12 / s.pz;
        const x = vx + Math.cos(s.a) * s.r * f * R * 0.5, y = vy + Math.sin(s.a) * s.r * f * R * 0.5;
        const px = vx + Math.cos(s.a) * s.r * pf * R * 0.5, py = vy + Math.sin(s.a) * s.r * pf * R * 0.5;
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) { s.z = 1; continue; }
        const k = 1 - s.z, col = s.hue < 0.5 ? mix(base, [255, 255, 255], 0.5) : mix(c2, [255, 255, 255], 0.35);
        ctx.strokeStyle = rgba(col, Math.min(1, k * 1.4) * 0.9);
        ctx.lineWidth = 0.6 + k * 1.8;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x + 0.01, y + 0.01); ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className="warp" aria-hidden />;
}
