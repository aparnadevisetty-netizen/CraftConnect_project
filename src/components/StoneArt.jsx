import { useId } from 'react';

/**
 * Hand-built stone-relief illustrations. Used wherever a photograph is not yet available, and as a fast,
 * tiny (SVG) fallback on slow connections. Each piece is drawn in a 400 x 400 box.
 * kind: deity | pillar | jali | lotus | mandala | lamp | mortar | kalash
 */
const TONES = {
  slate: { light: '#8a9186', base: '#5d635c', dark: '#3a3e3a', hi: '#b3baa9', bg1: '#efe6d2', bg2: '#dccaa6' },
  sage: { light: '#b4bea8', base: '#8c987f', dark: '#5d6853', hi: '#d8e0cb', bg1: '#f3ecdb', bg2: '#e3d5b6' },
  sand: { light: '#ecdab7', base: '#d2b88e', dark: '#9d7f55', hi: '#faf0d8', bg1: '#efe7d8', bg2: '#d9c7a3' },
  terra: { light: '#d98f73', base: '#b8664a', dark: '#82402d', hi: '#f0b9a0', bg1: '#f5e9d9', bg2: '#e4cfae' },
};

const VIEWBOX = { full: '0 0 400 400', detail: '110 80 180 180', texture: '150 150 90 90' };

function Shapes({ kind, variant, c, g, f }) {
  const stroke = { stroke: c.dark, strokeOpacity: 0.55, fill: 'none', strokeLinecap: 'round' };
  const hi = { stroke: c.hi, strokeOpacity: 0.5, fill: 'none', strokeLinecap: 'round' };
  const body = { fill: `url(#${g})`, filter: `url(#${f})` };
  const dim = { fill: c.dark, fillOpacity: 0.45 };

  switch (kind) {
    case 'deity': {
      const ganesha = variant === 'ganesha';
      return (
        <g>
          <ellipse cx="200" cy="352" rx="120" ry="14" fill="#000" opacity=".14" />
          {/* lotus pedestal */}
          <path d="M92 330 Q200 372 308 330 L296 306 Q200 336 104 306 Z" {...body} />
          <path d="M104 318 Q200 348 296 318" {...stroke} strokeWidth="2" />
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M${112 + i * 22} 318 q10 14 20 0`} {...stroke} strokeWidth="2" />
          ))}
          {/* halo */}
          <circle cx="200" cy="140" r="86" {...stroke} strokeWidth="3" strokeDasharray="2 9" />
          <path d="M120 150 A80 80 0 0 1 280 150" {...stroke} strokeWidth="3" />
          {/* folded legs and lap */}
          <path d="M104 300 Q130 250 200 258 Q270 250 296 300 Q200 326 104 300 Z" {...body} />
          <path d="M130 292 Q200 312 270 292" {...stroke} strokeWidth="2" />
          {/* torso */}
          <path d="M146 196 Q200 170 254 196 L268 270 Q200 292 132 270 Z" {...body} />
          {/* arms */}
          <path d="M146 200 Q112 236 124 276 Q140 268 150 250 Z" {...body} />
          <path d="M254 200 Q288 236 276 276 Q260 268 250 250 Z" {...body} />
          {/* jewellery lines */}
          <path d="M160 202 Q200 238 240 202" {...stroke} strokeWidth="3" />
          <path d="M168 212 Q200 244 232 212" {...stroke} strokeWidth="2" strokeDasharray="1 6" />
          <path d="M156 236 Q200 262 244 236" {...hi} strokeWidth="2" />
          {ganesha ? (
            <g>
              <ellipse cx="148" cy="130" rx="32" ry="42" {...body} />
              <ellipse cx="252" cy="130" rx="32" ry="42" {...body} />
              <ellipse cx="148" cy="130" rx="18" ry="28" {...stroke} strokeWidth="2" />
              <ellipse cx="252" cy="130" rx="18" ry="28" {...stroke} strokeWidth="2" />
              <ellipse cx="200" cy="130" rx="40" ry="46" {...body} />
              <path d="M200 142 Q200 196 214 214 Q224 226 216 238 Q204 236 202 224 Q200 205 188 178" {...body} />
              <path d="M200 150 Q202 196 214 214" {...hi} strokeWidth="2" />
              <circle cx="184" cy="118" r="4" fill={c.dark} fillOpacity=".7" />
              <circle cx="216" cy="118" r="4" fill={c.dark} fillOpacity=".7" />
              <path d="M170 90 L200 60 L230 90 Z" {...body} />
              <path d="M178 90 Q200 74 222 90" {...stroke} strokeWidth="2" />
              <circle cx="200" cy="70" r="5" fill={c.hi} fillOpacity=".8" />
              <path d="M170 150 Q158 170 164 186" {...stroke} strokeWidth="5" />
              <circle cx="266" cy="270" r="14" {...body} />
              <path d="M258 270 h16" {...stroke} strokeWidth="2" />
            </g>
          ) : (
            <g>
              <ellipse cx="200" cy="128" rx="34" ry="42" {...body} />
              <path d="M178 108 Q200 98 222 108" {...stroke} strokeWidth="3" />
              <path d="M184 124 q8 -6 16 0 M200 124 q8 -6 16 0" {...stroke} strokeWidth="3" />
              <path d="M192 148 Q200 154 208 148" {...stroke} strokeWidth="3" />
              <path d="M166 100 L172 62 L200 44 L228 62 L234 100 Z" {...body} />
              <path d="M174 90 L200 66 L226 90" {...stroke} strokeWidth="2" />
              <circle cx="200" cy="54" r="5" fill={c.hi} fillOpacity=".8" />
              <circle cx="124" cy="274" r="16" {...body} />
              <circle cx="276" cy="274" r="16" {...body} />
              <path d="M112 274 h24 M264 274 h24" {...stroke} strokeWidth="2" />
              <ellipse cx="170" cy="150" rx="5" ry="12" fill={c.dark} fillOpacity=".45" />
              <ellipse cx="230" cy="150" rx="5" ry="12" fill={c.dark} fillOpacity=".45" />
            </g>
          )}
        </g>
      );
    }

    case 'pillar':
      return (
        <g>
          <ellipse cx="200" cy="360" rx="110" ry="12" fill="#000" opacity=".14" />
          <rect x="120" y="326" width="160" height="30" rx="4" {...body} />
          <path d="M138 326 Q200 296 262 326 Z" {...body} />
          <path d="M140 322 Q200 300 260 322" {...stroke} strokeWidth="2" />
          <rect x="164" y="104" width="72" height="212" {...body} />
          {[176, 188, 200, 212, 224].map((x) => <line key={x} x1={x} y1="112" x2={x} y2="310" {...stroke} strokeWidth="2" />)}
          {[150, 214, 278].map((y) => (
            <g key={y}>
              <rect x="158" y={y} width="84" height="14" rx="3" {...body} />
              <rect x="158" y={y} width="84" height="14" rx="3" {...stroke} strokeWidth="1.5" />
            </g>
          ))}
          <circle cx="200" cy="182" r="14" {...stroke} strokeWidth="2.5" />
          <circle cx="200" cy="182" r="5" fill={c.hi} fillOpacity=".6" />
          <rect x="148" y="86" width="104" height="20" rx="4" {...body} />
          <path d="M148 86 Q112 84 108 62 Q130 66 148 74 Z" {...body} />
          <path d="M252 86 Q288 84 292 62 Q270 66 252 74 Z" {...body} />
          <circle cx="118" cy="68" r="8" {...stroke} strokeWidth="2.5" />
          <circle cx="282" cy="68" r="8" {...stroke} strokeWidth="2.5" />
          <rect x="96" y="44" width="208" height="20" rx="4" {...body} />
          <path d="M104 54 h192" {...hi} strokeWidth="2" />
        </g>
      );

    case 'jali':
      return (
        <g>
          <ellipse cx="200" cy="354" rx="130" ry="10" fill="#000" opacity=".12" />
          <rect x="62" y="62" width="276" height="276" rx="10" {...body} />
          <rect x="76" y="76" width="248" height="248" rx="4" {...stroke} strokeWidth="2.5" />
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 5 }).map((_, k) => {
              const cx = 112 + k * 44, cy = 112 + r * 44;
              return (
                <g key={`${r}-${k}`}>
                  <path d={`M${cx} ${cy - 17} L${cx + 17} ${cy} L${cx} ${cy + 17} L${cx - 17} ${cy} Z`} fill={c.bg2} stroke={c.dark} strokeOpacity=".7" strokeWidth="2.5" />
                  <circle cx={cx} cy={cy} r="5" fill={c.dark} fillOpacity=".5" />
                </g>
              );
            })
          )}
          <path d="M70 70 L330 70" {...hi} strokeWidth="2" />
        </g>
      );

    case 'lotus':
      if (variant === 'coaster') {
        return (
          <g>
            {[{ x: 50, y: 70 }, { x: 214, y: 70 }, { x: 50, y: 214 }, { x: 214, y: 214 }].map((p, i) => (
              <g key={i} transform={`translate(${p.x} ${p.y})`}>
                <ellipse cx="68" cy="132" rx="64" ry="8" fill="#000" opacity=".12" />
                <rect width="136" height="128" rx="64" {...body} />
                <rect x="10" y="10" width="116" height="108" rx="54" {...stroke} strokeWidth="2" />
                {Array.from({ length: 8 }).map((_, k) => (
                  <ellipse key={k} cx="68" cy="34" rx="9" ry="22" transform={`rotate(${k * 45} 68 64)`} fill={c.light} stroke={c.dark} strokeOpacity=".5" strokeWidth="1.5" />
                ))}
                <circle cx="68" cy="64" r="9" fill={c.dark} fillOpacity=".5" />
              </g>
            ))}
          </g>
        );
      }
      return (
        <g>
          <ellipse cx="200" cy="356" rx="130" ry="10" fill="#000" opacity=".12" />
          <rect x="52" y="52" width="296" height="296" rx="20" {...body} />
          <rect x="66" y="66" width="268" height="268" rx="12" {...stroke} strokeWidth="2.5" />
          <rect x="76" y="76" width="248" height="248" rx="8" {...stroke} strokeWidth="1.5" strokeDasharray="3 7" />
          {[{ n: 12, ry: 92, rx: 20, cy: 108, fill: c.dark, o: 0.35 }, { n: 10, ry: 76, rx: 22, cy: 124, fill: c.base, o: 1 }, { n: 8, ry: 58, rx: 22, cy: 142, fill: c.light, o: 1 }, { n: 6, ry: 38, rx: 18, cy: 162, fill: c.hi, o: 0.9 }].map((l, i) => (
            <g key={i}>
              {Array.from({ length: l.n }).map((_, k) => (
                <ellipse key={k} cx="200" cy={l.cy} rx={l.rx} ry={l.ry / 2} transform={`rotate(${(360 / l.n) * k + (i % 2) * 15} 200 200)`} fill={l.fill} fillOpacity={l.o} stroke={c.dark} strokeOpacity=".5" strokeWidth="2" />
              ))}
            </g>
          ))}
          <circle cx="200" cy="200" r="22" fill={c.dark} fillOpacity=".55" />
          {Array.from({ length: 9 }).map((_, k) => <circle key={k} cx={200 + Math.cos(k * 0.7) * 11} cy={200 + Math.sin(k * 0.7) * 11} r="2.6" fill={c.hi} />)}
        </g>
      );

    case 'mandala':
      return (
        <g>
          <ellipse cx="200" cy="360" rx="120" ry="10" fill="#000" opacity=".12" />
          <circle cx="200" cy="200" r="150" {...body} />
          <circle cx="200" cy="200" r="138" {...stroke} strokeWidth="2.5" />
          <circle cx="200" cy="200" r="126" {...stroke} strokeWidth="1.5" strokeDasharray="2 8" />
          {Array.from({ length: 16 }).map((_, k) => (
            <ellipse key={k} cx="200" cy="108" rx="16" ry="34" transform={`rotate(${k * 22.5} 200 200)`} fill={c.light} fillOpacity=".9" stroke={c.dark} strokeOpacity=".55" strokeWidth="2" />
          ))}
          <circle cx="200" cy="200" r="70" {...stroke} strokeWidth="2.5" />
          {Array.from({ length: 8 }).map((_, k) => (
            <ellipse key={k} cx="200" cy="158" rx="12" ry="26" transform={`rotate(${k * 45 + 22.5} 200 200)`} fill={c.base} stroke={c.dark} strokeOpacity=".55" strokeWidth="2" />
          ))}
          <polygon points="200,170 210,192 232,192 214,206 220,228 200,214 180,228 186,206 168,192 190,192" fill={c.hi} fillOpacity=".75" stroke={c.dark} strokeOpacity=".5" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="7" fill={c.dark} fillOpacity=".6" />
        </g>
      );

    case 'lamp':
      if (variant === 'bowl') {
        return (
          <g>
            <ellipse cx="200" cy="334" rx="130" ry="14" fill="#000" opacity=".14" />
            <path d="M70 200 Q80 320 200 322 Q320 320 330 200 Z" {...body} />
            <ellipse cx="200" cy="200" rx="130" ry="34" {...body} />
            <ellipse cx="200" cy="202" rx="108" ry="24" fill={c.dark} fillOpacity=".55" />
            <ellipse cx="200" cy="206" rx="92" ry="16" fill="#d9a441" fillOpacity=".5" />
            <path d="M200 208 q-10 -28 0 -60 q10 32 0 60 Z" fill="#e8b84a" />
            <path d="M200 200 q-5 -14 0 -30 q5 16 0 30 Z" fill="#fbe49a" />
            <path d="M96 252 Q200 300 304 252" {...stroke} strokeWidth="2.5" />
            {Array.from({ length: 11 }).map((_, i) => <circle key={i} cx={104 + i * 19.2} cy={262 + Math.sin((i / 10) * Math.PI) * 18} r="3" fill={c.hi} fillOpacity=".6" />)}
          </g>
        );
      }
      return (
        <g>
          <ellipse cx="200" cy="358" rx="108" ry="12" fill="#000" opacity=".14" />
          <path d="M96 340 Q200 372 304 340 L292 318 Q200 340 108 318 Z" {...body} />
          <rect x="184" y="196" width="32" height="124" {...body} />
          {[222, 258, 294].map((y) => <ellipse key={y} cx="200" cy={y} rx="26" ry="8" {...body} />)}
          {[222, 258, 294].map((y) => <ellipse key={`s${y}`} cx="200" cy={y} rx="26" ry="8" {...stroke} strokeWidth="2" />)}
          <path d="M104 150 Q112 214 200 216 Q288 214 296 150 Z" {...body} />
          <ellipse cx="200" cy="150" rx="96" ry="22" {...body} />
          <ellipse cx="200" cy="152" rx="78" ry="14" fill={c.dark} fillOpacity=".55" />
          {[130, 200, 270].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="116" r="12" {...body} />
              <path d={`M${x} 114 q-7 -22 0 -46 q7 24 0 46 Z`} fill="#e8b84a" />
              <path d={`M${x} 108 q-3 -10 0 -22 q3 12 0 22 Z`} fill="#fbe49a" />
            </g>
          ))}
          <path d="M116 180 Q200 214 284 180" {...stroke} strokeWidth="2.5" />
        </g>
      );

    case 'mortar':
      if (variant === 'pestle') {
        return (
          <g>
            <ellipse cx="200" cy="344" rx="130" ry="14" fill="#000" opacity=".15" />
            <path d="M92 190 L108 322 Q200 346 292 322 L308 190 Z" {...body} />
            <ellipse cx="200" cy="190" rx="108" ry="30" {...body} />
            <ellipse cx="200" cy="192" rx="86" ry="21" fill={c.dark} fillOpacity=".6" />
            <path d="M112 262 Q200 292 288 262" {...stroke} strokeWidth="2.5" />
            <rect x="228" y="64" width="40" height="190" rx="20" transform="rotate(12 248 160)" {...body} />
            <ellipse cx="238" cy="72" rx="22" ry="8" transform="rotate(12 238 72)" {...stroke} strokeWidth="2" />
          </g>
        );
      }
      return (
        <g>
          <ellipse cx="200" cy="336" rx="150" ry="16" fill="#000" opacity=".15" />
          <path d="M52 232 L52 300 Q200 358 348 300 L348 232 Z" {...body} />
          <ellipse cx="200" cy="232" rx="148" ry="46" {...body} />
          <ellipse cx="200" cy="232" rx="118" ry="32" {...stroke} strokeWidth="2.5" />
          <ellipse cx="200" cy="236" rx="22" ry="8" fill={c.dark} fillOpacity=".6" />
          <rect x="110" y="178" width="180" height="60" rx="30" {...body} />
          <ellipse cx="290" cy="208" rx="14" ry="30" fill={c.light} stroke={c.dark} strokeOpacity=".5" strokeWidth="2" />
          <path d="M126 192 H274" {...hi} strokeWidth="2" />
          <circle cx="110" cy="208" r="22" {...body} />
          <path d="M70 252 Q200 292 330 252" {...stroke} strokeWidth="2" strokeDasharray="1 6" />
        </g>
      );

    case 'kalash':
      return (
        <g>
          <ellipse cx="200" cy="354" rx="92" ry="12" fill="#000" opacity=".14" />
          <path d="M148 330 L156 346 L244 346 L252 330 Z" {...body} />
          <path d="M130 170 Q70 250 148 330 L252 330 Q330 250 270 170 Z" {...body} />
          <path d="M152 134 L148 170 L252 170 L248 134 Z" {...body} />
          <ellipse cx="200" cy="132" rx="62" ry="14" {...body} />
          <ellipse cx="200" cy="132" rx="46" ry="9" fill={c.dark} fillOpacity=".5" />
          <path d="M96 232 Q200 264 304 232" {...stroke} strokeWidth="3" />
          <path d="M104 262 Q200 296 296 262" {...stroke} strokeWidth="2" strokeDasharray="2 7" />
          {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={122 + i * 22.4} cy={246 + Math.sin((i / 7) * Math.PI) * 14} r="4" fill={c.hi} fillOpacity=".7" />)}
          <path d="M150 170 H250" {...stroke} strokeWidth="2.5" />
          <ellipse cx="200" cy="108" rx="24" ry="22" {...body} />
          <path d="M184 100 q16 -12 32 0" {...hi} strokeWidth="2" />
          {[-1, 1].map((s) => (
            <path key={s} d={`M${200 + s * 18} 118 Q${200 + s * 70} 80 ${200 + s * 62} 40 Q${200 + s * 28} 70 ${200 + s * 18} 118 Z`} fill={c.light} stroke={c.dark} strokeOpacity=".5" strokeWidth="2" />
          ))}
        </g>
      );

    default:
      return <circle cx="200" cy="200" r="120" {...body} />;
  }
}

export default function StoneArt({ art, tone = 'slate', view = 'full', className = '', title = '', rounded = false }) {
  const id = useId().replace(/:/g, '');
  const c = TONES[tone] || TONES.slate;
  const g = `g${id}`, f = `f${id}`, bg = `b${id}`;
  const kind = art?.kind || 'mandala';
  return (
    <svg
      viewBox={VIEWBOX[view] || VIEWBOX.full}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title || kind}
      className={`h-full w-full ${rounded ? 'rounded-[inherit]' : ''} ${className}`}
      style={{ background: `radial-gradient(circle at 30% 20%, ${c.bg1}, ${c.bg2})` }}
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset=".55" stopColor={c.base} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <radialGradient id={bg}><stop offset="0" stopColor={c.hi} stopOpacity=".5" /><stop offset="1" stopColor={c.hi} stopOpacity="0" /></radialGradient>
        <filter id={f} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" result="speck" />
          <feComposite in="speck" in2="SourceGraphic" operator="in" result="g" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="g" /></feMerge>
        </filter>
      </defs>
      <circle cx="200" cy="190" r="190" fill={`url(#${bg})`} />
      <Shapes kind={kind} variant={art?.variant} c={c} g={g} f={f} />
    </svg>
  );
}
