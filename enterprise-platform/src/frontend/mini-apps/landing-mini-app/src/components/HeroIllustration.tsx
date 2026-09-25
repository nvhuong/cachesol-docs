/**
 * HeroIllustration — pure inline SVG for the landing hero.
 * Renders a stylised "platform" dashboard mock with floating mini-app tiles.
 * Designed to be readable, not abstract — looks like a real product UI.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 460"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CacheSol platform preview"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="cs-card-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
        <linearGradient id="cs-grad-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        <linearGradient id="cs-grad-purple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id="cs-grad-pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DB2777" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="cs-grad-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
        <linearGradient id="cs-grad-orange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="cs-grad-cyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="cs-grad-chart" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="cs-card-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
          <feOffset dx="0" dy="8" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.15" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft background orbs */}
      <circle cx="60" cy="80" r="120" fill="url(#cs-grad-blue)" opacity="0.06" />
      <circle cx="460" cy="380" r="140" fill="url(#cs-grad-purple)" opacity="0.06" />

      {/* Main dashboard card (the "platform") */}
      <g filter="url(#cs-card-shadow)">
        <rect
          x="100"
          y="60"
          width="320"
          height="340"
          rx="18"
          fill="url(#cs-card-bg)"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />

        {/* Dashboard top bar */}
        <rect x="100" y="60" width="320" height="46" rx="18" fill="#FFFFFF" />
        <rect x="100" y="92" width="320" height="14" fill="#FFFFFF" />
        <rect x="100" y="106" width="320" height="2" fill="#F1F5F9" />

        {/* Window controls */}
        <circle cx="118" cy="83" r="5" fill="#EF4444" opacity="0.85" />
        <circle cx="134" cy="83" r="5" fill="#F59E0B" opacity="0.85" />
        <circle cx="150" cy="83" r="5" fill="#22C55E" opacity="0.85" />

        {/* URL bar */}
        <rect x="178" y="74" width="170" height="18" rx="6" fill="#F1F5F9" />
        <rect x="186" y="80" width="60" height="6" rx="3" fill="#CBD5E1" />

        {/* Header title */}
        <rect x="120" y="124" width="120" height="10" rx="5" fill="#0F172A" />
        <rect x="120" y="142" width="80" height="6" rx="3" fill="#94A3B8" />

        {/* KPI cards row */}
        <g transform="translate(120, 162)">
          <rect width="84" height="56" rx="10" fill="#EFF6FF" stroke="#DBEAFE" />
          <rect x="10" y="10" width="40" height="6" rx="3" fill="#1D4ED8" opacity="0.7" />
          <rect x="10" y="24" width="48" height="14" rx="3" fill="#1D4ED8" />
          <rect x="10" y="44" width="32" height="4" rx="2" fill="#60A5FA" opacity="0.5" />
        </g>
        <g transform="translate(214, 162)">
          <rect width="84" height="56" rx="10" fill="#F0FDF4" stroke="#DCFCE7" />
          <rect x="10" y="10" width="40" height="6" rx="3" fill="#15803D" opacity="0.7" />
          <rect x="10" y="24" width="48" height="14" rx="3" fill="#15803D" />
          <rect x="10" y="44" width="32" height="4" rx="2" fill="#22C55E" opacity="0.5" />
        </g>
        <g transform="translate(308, 162)">
          <rect width="84" height="56" rx="10" fill="#FFF7ED" stroke="#FFEDD5" />
          <rect x="10" y="10" width="40" height="6" rx="3" fill="#C2410C" opacity="0.7" />
          <rect x="10" y="24" width="48" height="14" rx="3" fill="#C2410C" />
          <rect x="10" y="44" width="32" height="4" rx="2" fill="#F97316" opacity="0.5" />
        </g>

        {/* Chart area */}
        <g transform="translate(120, 232)">
          <rect width="272" height="146" rx="10" fill="#F8FAFC" stroke="#F1F5F9" />
          <rect x="14" y="14" width="60" height="6" rx="3" fill="#475569" />
          <rect x="14" y="26" width="40" height="4" rx="2" fill="#94A3B8" />

          {/* Grid lines */}
          <line x1="14" y1="60" x2="258" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1="14" y1="90" x2="258" y2="90" stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1="14" y1="120" x2="258" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" />

          {/* Area chart */}
          <path
            d="M 14 110 L 50 95 L 86 100 L 122 70 L 158 78 L 194 50 L 230 60 L 258 35 L 258 130 L 14 130 Z"
            fill="url(#cs-grad-chart)"
            opacity="0.15"
          />
          <path
            d="M 14 110 L 50 95 L 86 100 L 122 70 L 158 78 L 194 50 L 230 60 L 258 35"
            stroke="url(#cs-grad-chart)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          <circle cx="50" cy="95" r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
          <circle cx="122" cy="70" r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
          <circle cx="194" cy="50" r="3.5" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2" />
          <circle cx="258" cy="35" r="3.5" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2" />
        </g>
      </g>

      {/* Floating notification card top-right */}
      <g filter="url(#cs-card-shadow)">
        <rect x="380" y="40" width="124" height="56" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <circle cx="402" cy="68" r="14" fill="url(#cs-grad-green)" />
        <path d="M 396 68 L 401 73 L 410 63" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="424" y="56" width="68" height="6" rx="3" fill="#0F172A" />
        <rect x="424" y="68" width="50" height="4" rx="2" fill="#94A3B8" />
        <rect x="424" y="78" width="60" height="4" rx="2" fill="#CBD5E1" />
      </g>

      {/* Floating mini-app tile bottom-left */}
      <g filter="url(#cs-card-shadow)">
        <rect x="20" y="270" width="100" height="100" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect x="36" y="286" width="68" height="68" rx="10" fill="url(#cs-grad-blue)" />
        {/* HRM icon - 3 persons */}
        <g transform="translate(56, 304)">
          <circle cx="0" cy="6" r="6" fill="#FFFFFF" />
          <circle cx="14" cy="6" r="6" fill="#FFFFFF" />
          <path d="M -8 22 Q -8 14 0 14 Q 8 14 8 22" fill="#FFFFFF" />
          <path d="M 6 22 Q 6 14 14 14 Q 22 14 22 22" fill="#FFFFFF" />
        </g>
        <rect x="36" y="362" width="50" height="5" rx="2.5" fill="#0F172A" />
      </g>

      {/* Floating analytics card bottom-right */}
      <g filter="url(#cs-card-shadow)">
        <rect x="380" y="320" width="124" height="100" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect x="394" y="334" width="60" height="6" rx="3" fill="#7C3AED" />
        <rect x="394" y="346" width="40" height="4" rx="2" fill="#94A3B8" />

        {/* mini bar chart */}
        <rect x="394" y="372" width="12" height="36" rx="3" fill="url(#cs-grad-purple)" opacity="0.4" />
        <rect x="410" y="362" width="12" height="46" rx="3" fill="url(#cs-grad-purple)" opacity="0.6" />
        <rect x="426" y="378" width="12" height="30" rx="3" fill="url(#cs-grad-purple)" opacity="0.5" />
        <rect x="442" y="354" width="12" height="54" rx="3" fill="url(#cs-grad-purple)" />
        <rect x="458" y="368" width="12" height="40" rx="3" fill="url(#cs-grad-purple)" opacity="0.7" />
        <rect x="474" y="358" width="12" height="50" rx="3" fill="url(#cs-grad-purple)" opacity="0.85" />

        <rect x="394" y="412" width="44" height="4" rx="2" fill="#0F172A" />
      </g>

      {/* Floating pink bubble top-left */}
      <g filter="url(#cs-card-shadow)">
        <rect x="20" y="40" width="76" height="76" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect x="34" y="54" width="48" height="48" rx="10" fill="url(#cs-grad-pink)" />
        <path
          d="M 50 78 L 56 84 L 70 70"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default HeroIllustration;
