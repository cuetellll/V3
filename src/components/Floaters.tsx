import type { CSSProperties } from 'react';

/**
 * v3.0 · اشیای سه‌بعدی شناور دور صحنه (سپر، قفل، سیاره، صاعقه، ستاره، کلید)
 * هر کدوم یه ضخامت (اکسترود) و نور براق دارن، آروم بالا پایین میرن و با موس پارالاکس دارن.
 */
type Shape = { id: string; d: string; c: [string, string]; x: string; y: string; s: number; z: number; r: number; dl: number };

const SHAPES: Shape[] = [
  { id: 'shield', d: 'M12 2.2l8 3.1v6c0 5.2-3.4 9-8 10.5-4.6-1.5-8-5.3-8-10.5v-6z', c: ['#7dffc4', '#0bae78'], x: '9%', y: '18%', s: 62, z: 1.6, r: -14, dl: 0 },
  { id: 'bolt', d: 'M13.6 2L4.5 13.4h6.2L9.6 22l9.3-11.6h-6.3z', c: ['#fff27a', '#ff9d00'], x: '84%', y: '14%', s: 50, z: 1.1, r: 16, dl: 1.2 },
  { id: 'lock', d: 'M7 10V7.6a5 5 0 0 1 10 0V10h.6A2.4 2.4 0 0 1 20 12.4v7.2a2.4 2.4 0 0 1-2.4 2.4H6.4A2.4 2.4 0 0 1 4 19.6v-7.2A2.4 2.4 0 0 1 6.4 10zm2.6 0h4.8V7.6a2.4 2.4 0 0 0-4.8 0z', c: ['#c4a5ff', '#7034e8'], x: '6%', y: '70%', s: 52, z: 0.9, r: 10, dl: 2.1 },
  { id: 'star', d: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z', c: ['#ff9be7', '#e0338f'], x: '90%', y: '64%', s: 44, z: 1.4, r: -8, dl: 0.6 },
  { id: 'key', d: 'M8 4a6 6 0 0 1 5.6 8.1L21 19.5V22h-3v-2h-2v-2h-2l-1.9-1.9A6 6 0 1 1 8 4zm-1.2 3.6a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z', c: ['#ffd666', '#ff7a1a'], x: '76%', y: '86%', s: 40, z: 0.7, r: 24, dl: 3 },
];

function Puffy({ sh }: { sh: Shape }) {
  const g = `fl-${sh.id}`;
  return (
    <svg viewBox="-2 -2 28 30" width={sh.s} height={sh.s * 1.07}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor={sh.c[0]} /><stop offset="1" stopColor={sh.c[1]} /></linearGradient>
        <linearGradient id={`${g}-hl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".75" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <clipPath id={`${g}-c`}><path d={sh.d} /></clipPath>
      </defs>
      {/* ضخامت */}
      {[3, 2.4, 1.8, 1.2, 0.6].map((o) => <path key={o} d={sh.d} transform={`translate(0 ${o})`} fill={sh.c[1]} style={{ filter: 'brightness(.55)' }} />)}
      <path d={sh.d} fill={`url(#${g})`} />
      <g clipPath={`url(#${g}-c)`}>
        <ellipse cx="9" cy="5" rx="11" ry="7" fill={`url(#${g}-hl)`} />
        <path d={sh.d} fill="none" stroke="#000" strokeOpacity=".18" strokeWidth="2.2" transform="translate(0 1.2)" />
      </g>
      <ellipse cx="7.5" cy="6.5" rx="1.6" ry="1" fill="#fff" opacity=".9" transform="rotate(-30 7.5 6.5)" />
    </svg>
  );
}

/** سیاره با حلقه */
function Planet() {
  return (
    <svg viewBox="0 0 64 64" width="74" height="74">
      <defs>
        <radialGradient id="pl-b" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#bfe9ff" /><stop offset=".45" stopColor="#4f8dff" /><stop offset="1" stopColor="#2a1d8f" /></radialGradient>
        <linearGradient id="pl-r" x1="0" x2="1"><stop offset="0" stopColor="#ff9be7" /><stop offset="1" stopColor="#ffd666" /></linearGradient>
      </defs>
      <path d="M8 38c-6 6 1 9 14 6s30-12 36-19c3-4-1-6-8-5" fill="none" stroke="url(#pl-r)" strokeWidth="4" strokeLinecap="round" opacity=".55" />
      <circle cx="32" cy="32" r="17" fill="url(#pl-b)" />
      <path d="M17 30c6 3 20 3 30-3" stroke="#fff" strokeOpacity=".18" strokeWidth="3" fill="none" />
      <ellipse cx="25" cy="23" rx="5" ry="3" fill="#fff" opacity=".55" transform="rotate(-30 25 23)" />
      <path d="M50 20c7-1 11 1 8 5-6 7-23 16-36 19s-20 0-14-6" fill="none" stroke="url(#pl-r)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function Floaters({ show = true }: { show?: boolean }) {
  if (!show) return null;
  return (
    <div className="floaters" aria-hidden>
      {SHAPES.map((sh) => (
        <span key={sh.id} className="fl" style={{ left: sh.x, top: sh.y, '--z': sh.z, '--r': `${sh.r}deg`, '--dl': `${-sh.dl}s` } as CSSProperties}>
          <span className="fl-in"><Puffy sh={sh} /></span>
        </span>
      ))}
      <span className="fl" style={{ left: '80%', top: '38%', '--z': 0.5, '--r': '-10deg', '--dl': '-4s' } as CSSProperties}><span className="fl-in planet"><Planet /></span></span>
    </div>
  );
}
