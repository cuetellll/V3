import type { CSSProperties } from 'react';
import { I } from '../icons';

/**
 * v3.0 · آیکن سه‌بعدی «آب‌نباتی»: کاشی براق با ضخامت، نور بالا و سایه‌ی رنگی.
 * هر آیکن انیمیشن مخصوص خودش رو داره (چرخ‌دنده می‌چرخه، موشک می‌لرزه، رادار اسکن می‌کنه...)
 * انیمیشن با hover روی والد `.h3` یا با prop `live` فعال میشه.
 */
export type IcoName = keyof typeof I;
const TONES: Partial<Record<IcoName, [string, string]>> = {
  home: ['#ffb057', '#ff3d81'], servers: ['#5ee7ff', '#5b5bf7'], stats: ['#5cf2b0', '#0aa3c2'], settings: ['#c4a5ff', '#7034e8'],
  radar: ['#6af0ff', '#1677ff'], pulse: ['#ff8fa3', '#e0144c'], paste: ['#ffd666', '#ff7a1a'], rocket: ['#ff9be7', '#8c3dff'],
  bolt: ['#fff27a', '#ff9d00'], globe: ['#7cc3ff', '#2453ff'], lock: ['#7dffa8', '#0b9e6b'], refresh: ['#7af8ff', '#7a4dff'],
  cpu: ['#9ef0ff', '#3478ff'], proxy: ['#ffb3f0', '#c026d3'], clock: ['#ffe08a', '#f2690d'], down: ['#6ff3ff', '#0e8fd6'],
  up: ['#ff9de4', '#d6338f'], keyboard: ['#d5d9ff', '#5f67c9'], palette: ['#ffc56b', '#ff4fb0'], sub: ['#9dffcf', '#16a38a'],
  star: ['#fff07a', '#ffae00'], shieldOk: ['#7dffc4', '#0bae78'], info: ['#b0c4ff', '#4f5bd5'], plus: ['#a6ffcb', '#12b886'],
  copy: ['#c9d2ff', '#5865f2'], download: ['#9dffcf', '#00a86b'], alert: ['#ffb199', '#ff3b3b'], check: ['#8affc1', '#05a660'],
} as any;

export default function Ico3({ name, size = 'm', live, tone, className = '' }: { name: IcoName; size?: 's' | 'm' | 'l' | 'xl'; live?: boolean; tone?: [string, string]; className?: string }) {
  const [c1, c2] = tone ?? TONES[name] ?? ['var(--a1)', 'var(--a2)'];
  return (
    <span className={`i3 i3-${name} ${size} ${live ? 'live' : ''} ${className}`} style={{ '--c1': c1, '--c2': c2 } as CSSProperties} aria-hidden>
      <span className="i3-g">{I[name]}</span>
    </span>
  );
}
