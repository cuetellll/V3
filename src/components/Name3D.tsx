/**
 * v3.0 · اسم سه‌بعدی MAHYAR VPN
 * هر حرف یه بلوک اکسترود شده‌ست که موجی بالا پایین میره؛ زیر موس ژله‌ای می‌پره.
 * «VPN» رنگ وضعیت اتصال رو می‌گیره.
 */
export default function Name3D({ size = 'l', status = 'idle' }: { size?: 's' | 'm' | 'l'; status?: string }) {
  const words = ['MAHYAR', 'VPN'];
  let k = 0;
  return (
    <span className={`n3 ${size} ${status}`} aria-label="MAHYAR VPN" dir="ltr" role="img">
      {words.map((wd, wi) => (
        <span key={wd} className={`n3-w ${wi ? 'vpn' : ''}`}>
          {wd.split('').map((ch) => {
            const i = k++;
            return (
              <span key={i} className="n3-l" data-ch={ch} style={{ ['--i' as any]: i }}>
                <span className="n3-f">{ch}</span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
