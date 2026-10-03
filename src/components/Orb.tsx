import type { CSSProperties } from 'react';
import CoreIcon from './CoreIcon';

/**
 * v3.0 · دکمه‌ی اتصال «گوی»: کره‌ی براق سه‌بعدی با سه ماهواره که دورش می‌چرخن.
 * idle: صورتی/قرمز، تپش آروم · connecting: پلاسمای چرخان · connected: رنگ وضعیت + انفجار کانفتی
 */
type Props = {
  status: 'idle' | 'connecting' | 'connected';
  onClick: () => void;
  disabled?: boolean;
  label: string;
  sub: string;
  flash: number;
  shake?: boolean;
};

const CONF = Array.from({ length: 26 }, (_, i) => ({
  a: (i / 26) * 360 + (i % 3) * 7,
  d: 110 + ((i * 37) % 70),
  s: 6 + (i % 4) * 2,
  c: ['#fff27a', '#ff9be7', '#7dffc4', '#7cc3ff', '#ffb057', '#c4a5ff'][i % 6],
  r: (i * 53) % 360,
  sh: i % 3,
}));

export default function Orb({ status, onClick, disabled, label, sub, flash, shake }: Props) {
  return (
    <button className={`orb ${status} ${shake ? 'shake' : ''}`} onClick={onClick} disabled={disabled} aria-label={label}>
      <span className="orb-floor" />
      <span className="orb-aura" />
      <span className="orb-orbit o1"><i /></span>
      <span className="orb-orbit o2"><i /></span>
      <span className="orb-orbit o3"><i /></span>
      <span className="orb-ball">
        <span className="orb-plasma" />
        <span className="orb-core">
          <span className="orb-ic"><CoreIcon status={status} /></span>
          <span className="orb-tx">{sub}</span>
        </span>
        <span className="orb-gloss" />
        <span className="orb-spec" />
      </span>
      {flash > 0 && (
        <span className="orb-fx" key={flash}>
          <span className="shock" /><span className="shock s2" />
          {CONF.map((c, i) => (
            <i key={i} className={`cf sh${c.sh}`} style={{ '--a': `${c.a}deg`, '--d': `${c.d}px`, '--s': `${c.s}px`, '--c': c.c, '--r': `${c.r}deg` } as CSSProperties} />
          ))}
        </span>
      )}
    </button>
  );
}
