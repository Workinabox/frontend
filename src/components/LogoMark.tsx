/*
 * Workinabox logo mark — the chosen `toolboxAlt` direction:
 * an isometric work box whose outer edges alternate ink / orange, with a cog on the
 * top face, a briefcase on the left face, and a laptop on the right face.
 * Ported from assets/visual-identity/handoff/logos.js (toolboxAlt + toolIcons + gearPath),
 * kept in sync with the website repo's LogoMark.
 *
 * The monochrome stroke uses `currentColor`, so set `color` via `onInk`:
 *   onInk  -> paper stroke (mark sits on a dark ink surface)
 *   !onInk -> ink stroke   (mark sits on a light paper surface)
 * The alternating box edges are always var(--orange) / currentColor.
 */

const GEAR_PATH =
  'M111.0 64.0 L114.9 66.1 L114.3 68.6 L109.9 68.8 L107.8 71.8 L109.0 76.0 L106.8 77.4 ' +
  'L103.6 74.4 L100.0 75.0 L97.9 78.9 L95.4 78.3 L95.2 73.9 L92.2 71.8 L88.0 73.0 ' +
  'L86.6 70.8 L89.6 67.6 L89.0 64.0 L85.1 61.9 L85.7 59.4 L90.1 59.2 L92.2 56.2 ' +
  'L91.0 52.0 L93.2 50.6 L96.4 53.6 L100.0 53.0 L102.1 49.1 L104.6 49.7 L104.8 54.1 ' +
  'L107.8 56.2 L112.0 55.0 L113.4 57.2 L110.4 60.4 Z';

interface LogoMarkProps {
  /** Rendered size in px (square). */
  size?: number;
  /** True when the mark sits on a dark ink surface (stroke becomes paper). */
  onInk?: boolean;
  /** Stroke width in viewBox (200) units, matching the handoff `data-sw`. */
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const LogoMark = ({
  size = 40,
  onInk = false,
  strokeWidth = 8,
  className,
  style,
}: LogoMarkProps) => {
  const w = strokeWidth;
  const iw = Math.max(2, strokeWidth * 0.9);
  const ink = 'currentColor';
  const orange = 'var(--orange)';
  const edges: Array<[string, string]> = [
    ['M100 28 L168 64', orange],
    ['M168 64 L168 136', ink],
    ['M168 136 L100 172', orange],
    ['M100 172 L32 136', ink],
    ['M32 136 L32 64', orange],
    ['M32 64 L100 28', ink],
  ];

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-label="Workinabox mark"
      style={{ color: onInk ? 'var(--paper)' : 'var(--ink)', ...style }}
    >
      {edges.map(([d, c], i) => (
        <path
          key={i}
          d={d}
          stroke={c}
          strokeWidth={w}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      <path
        d="M32 64 L100 100 M168 64 L100 100 M100 100 L100 172"
        stroke={ink}
        strokeWidth={w}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g
        stroke={ink}
        strokeWidth={iw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d={GEAR_PATH} />
        <circle cx="100" cy="64" r="4" />
        <rect x="52" y="110" width="28" height="20" rx="3" />
        <path d="M60 110 L60 106 Q60 103 63 103 L69 103 Q72 103 72 106 L72 110" />
        <path d="M52 117 L80 117" />
        <rect x="120" y="107" width="28" height="16" rx="2" />
        <path d="M116 126 L152 126 L148 131 L120 131 Z" />
      </g>
    </svg>
  );
};

export default LogoMark;
