/**
 * Static SVG "posters" shown in the SSR HTML, while the 3D chunk loads, and
 * as the permanent fallback when WebGL isn't available.
 */

export function SpinePoster({ className = "" }: { className?: string }) {
  const levels = Array.from({ length: 22 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 760" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="sp-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0" stopColor="#45d6bf" stopOpacity="0.28" />
          <stop offset="1" stopColor="#45d6bf" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sp-bone" x1="0" x2="1">
          <stop offset="0" stopColor="#d9d1c3" />
          <stop offset="0.5" stopColor="#f7f2ea" />
          <stop offset="1" stopColor="#cfc6b6" />
        </linearGradient>
        <linearGradient id="sp-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e2b0" />
          <stop offset="1" stopColor="#b8913d" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="380" rx="190" ry="360" fill="url(#sp-glow)" />
      {/* crown */}
      <g transform="translate(200 70)">
        <circle r="46" fill="#d4af5c" opacity="0.16" />
        <path d="M-34 14-40-18l17 12 23-26 23 26 17-12-6 32z" fill="url(#sp-gold)" />
        <rect x="-34" y="18" width="68" height="7" rx="3.5" fill="url(#sp-gold)" />
        <circle cy="-36" r="5" fill="#fff1c9" />
      </g>
      {levels.map((i) => {
        const t = i / (levels.length - 1);
        const y = 150 + t * 560;
        const x = 200 + Math.sin(t * Math.PI * 2 + 0.3) * 18;
        const w = 34 + t * 34;
        return (
          <g key={i}>
            <rect x={x - w / 2} y={y} width={w} height={14 + t * 8} rx={7} fill="url(#sp-bone)" />
            <rect x={x - w / 2 + 4} y={y + 16 + t * 8} width={w - 8} height={4} rx={2} fill="#45d6bf" opacity="0.9" />
            <rect x={x - 6} y={y + 3} width={12} height={10 + t * 6} rx={4} fill="#c9bfae" transform={`translate(${w * 0.55} 0)`} />
          </g>
        );
      })}
    </svg>
  );
}

export function BodyPoster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 560" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="bp-skin" x1="0" x2="1">
          <stop offset="0" stopColor="#e2d9ca" />
          <stop offset="0.5" stopColor="#f6f1e8" />
          <stop offset="1" stopColor="#dcd2c1" />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="540" rx="90" ry="12" fill="#0a1e24" opacity="0.08" />
      <g fill="url(#bp-skin)">
        <ellipse cx="150" cy="58" rx="30" ry="36" />
        <rect x="138" y="88" width="24" height="26" rx="10" />
        <ellipse cx="150" cy="160" rx="56" ry="58" />
        <ellipse cx="150" cy="230" rx="42" ry="42" />
        <ellipse cx="150" cy="276" rx="50" ry="32" />
        <rect x="84" y="118" width="22" height="92" rx="11" transform="rotate(10 95 118)" />
        <rect x="194" y="118" width="22" height="92" rx="11" transform="rotate(-10 205 118)" />
        <rect x="78" y="204" width="18" height="84" rx="9" transform="rotate(8 87 204)" />
        <rect x="204" y="204" width="18" height="84" rx="9" transform="rotate(-8 213 204)" />
        <rect x="116" y="290" width="30" height="130" rx="15" />
        <rect x="154" y="290" width="30" height="130" rx="15" />
        <rect x="118" y="418" width="24" height="110" rx="12" />
        <rect x="158" y="418" width="24" height="110" rx="12" />
      </g>
      {[
        [150, 104],
        [200, 124],
        [150, 250],
        [128, 420],
        [98, 300],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="13" fill="#ee5d52" opacity="0.18" />
          <circle cx={x} cy={y} r="6" fill="#ee5d52" />
        </g>
      ))}
    </svg>
  );
}

export function StagePoster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 420" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="st-cone" cx="50%" cy="0%" r="100%">
          <stop offset="0" stopColor="#9ad8ff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#9ad8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M270 0h60l170 330H100z" fill="url(#st-cone)" />
      <ellipse cx="300" cy="330" rx="230" ry="46" fill="#0c2c31" />
      <ellipse cx="300" cy="326" rx="222" ry="42" fill="none" stroke="#45d6bf" strokeWidth="3" />
      <ellipse cx="300" cy="326" rx="140" ry="26" fill="none" stroke="#45d6bf" strokeOpacity="0.25" />
      <g fill="#efe8dd">
        <rect x="200" y="250" width="200" height="34" rx="14" />
        <path d="M215 250c0-70 55-110 85-110s85 40 85 110z" fill="#eaf6ff" opacity="0.35" stroke="#d9d4ca" />
        <rect x="392" y="170" width="16" height="100" rx="8" />
        <rect x="370" y="150" width="60" height="38" rx="8" fill="#0b1b22" />
      </g>
    </svg>
  );
}
