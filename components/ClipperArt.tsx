"use client";

import type { SVGProps } from "react";

export type ClipperPart = "guard" | "cutter" | "blade" | "motor" | "body";

type Props = SVGProps<SVGSVGElement> & {
  id: string;
  partRef?: (part: ClipperPart, el: SVGGElement | null) => void;
};

// A hair clipper drawn blade-up around the origin. Each part is its own <g> so a
// caller can pull them apart; drawing order keeps the motor hidden inside the
// body until the body slides away.
export default function ClipperArt({ id, partRef, ...svg }: Props) {
  const g = (name: string) => `${id}-${name}`;
  const url = (name: string) => `url(#${g(name)})`;
  const teeth = (from: number, to: number, step: number, y: number, h: number, w: number) =>
    Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => (
      <rect key={i} x={from + i * step - w / 2} y={y - h} width={w} height={h} rx={w / 2} />
    ));

  return (
    <svg {...svg}>
      <defs>
        <linearGradient id={g("body")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0E0E10" />
          <stop offset="0.18" stopColor="#2B2B30" />
          <stop offset="0.42" stopColor="#55555C" />
          <stop offset="0.6" stopColor="#26262A" />
          <stop offset="1" stopColor="#0A0A0B" />
        </linearGradient>
        <linearGradient id={g("gold")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6E560F" />
          <stop offset="0.35" stopColor="#E8C658" />
          <stop offset="0.55" stopColor="#F7E8AE" />
          <stop offset="0.75" stopColor="#C9A227" />
          <stop offset="1" stopColor="#5C470C" />
        </linearGradient>
        <linearGradient id={g("steel")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#3F3F44" />
          <stop offset="0.38" stopColor="#E9E9EE" />
          <stop offset="0.55" stopColor="#A4A4AB" />
          <stop offset="1" stopColor="#3A3A3F" />
        </linearGradient>
        <linearGradient id={g("copper")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5A2A10" />
          <stop offset="0.45" stopColor="#E08A4A" />
          <stop offset="0.6" stopColor="#B4602C" />
          <stop offset="1" stopColor="#4A220C" />
        </linearGradient>
        <radialGradient id={g("glow")}>
          <stop offset="0" stopColor="#F7D774" stopOpacity="0.85" />
          <stop offset="1" stopColor="#F7D774" stopOpacity="0" />
        </radialGradient>
        <pattern id={g("knurl")} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="none" />
          <path d="M0 0H10M0 0V10" stroke="#000" strokeOpacity="0.55" strokeWidth="2.2" />
          <path d="M1 1H10" stroke="#fff" strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
        <clipPath id={g("bodyClip")}>
          <path d="M-85 -150H85Q95 -150 95 -138L78 330Q76 380 0 385Q-76 380 -78 330L-95 -138Q-95 -150 -85 -150Z" />
        </clipPath>
      </defs>

      <g ref={(el) => partRef?.("motor", el)}>
        <circle cx="0" cy="-95" r="120" fill={url("glow")} />
        <rect x="-62" y="-145" width="124" height="96" rx="14" fill={url("copper")} />
        {Array.from({ length: 11 }, (_, i) => (
          <path
            key={i}
            d={`M-62 ${-138 + i * 8.4}H62`}
            stroke="#2A1206"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
        ))}
        <rect x="-20" y="-160" width="40" height="18" rx="4" fill={url("steel")} />
        <rect x="-70" y="-52" width="140" height="10" rx="5" fill={url("gold")} />
      </g>

      <g ref={(el) => partRef?.("body", el)}>
        <path
          d="M-85 -150H85Q95 -150 95 -138L78 330Q76 380 0 385Q-76 380 -78 330L-95 -138Q-95 -150 -85 -150Z"
          fill={url("body")}
        />
        <g clipPath={url("bodyClip")}>
          <rect x="-100" y="70" width="200" height="250" fill={url("knurl")} />
          <rect x="-100" y="-150" width="200" height="10" fill="#fff" opacity="0.06" />
        </g>
        <rect x="-93" y="-128" width="186" height="14" fill={url("gold")} />
        <rect x="-82" y="52" width="164" height="6" fill={url("gold")} opacity="0.85" />
        <rect x="-15" y="-92" width="30" height="62" rx="15" fill="#08080A" stroke="#3A3A3F" />
        <rect x="-9" y="-86" width="18" height="26" rx="9" fill={url("gold")} />
        <text
          x="0"
          y="18"
          textAnchor="middle"
          fontSize="30"
          letterSpacing="6"
          fill={url("gold")}
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          A&amp;T
        </text>
        <path d="M92 -110Q132 -96 128 -46Q126 -30 112 -34L88 -60Z" fill={url("steel")} />
        <path d="M0 385C0 440 34 470 30 540" stroke="#111113" strokeWidth="16" fill="none" strokeLinecap="round" />
        <rect x="-22" y="372" width="44" height="26" rx="8" fill={url("gold")} />
      </g>

      <g ref={(el) => partRef?.("blade", el)}>
        <path d="M-100 -150H100L110 -204H-110Z" fill={url("steel")} />
        <g fill={url("steel")}>{teeth(-104, 104, 8, -202, 18, 5)}</g>
        <rect x="-100" y="-160" width="200" height="6" fill="#000" opacity="0.25" />
      </g>

      <g ref={(el) => partRef?.("cutter", el)}>
        <path d="M-82 -168H82L88 -198H-88Z" fill={url("gold")} />
        <g fill={url("gold")}>{teeth(-84, 84, 8, -196, 10, 4)}</g>
        <circle cx="-50" cy="-183" r="5" fill="#2A2A2E" />
        <circle cx="50" cy="-183" r="5" fill="#2A2A2E" />
      </g>

      <g ref={(el) => partRef?.("guard", el)}>
        <path
          d="M-112 -140Q-116 -230 -104 -300H104Q116 -230 112 -140H96Q100 -220 92 -282H-92Q-100 -220 -96 -140Z"
          fill="#141416"
          fillOpacity="0.92"
          stroke="#C9A227"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
        <g stroke="#2E2E33" strokeWidth="5" strokeLinecap="round">
          {Array.from({ length: 14 }, (_, i) => {
            const x = -84 + i * 13;
            return <path key={i} d={`M${x} -290L${x * 1.04} -214`} />;
          })}
        </g>
        <text
          x="0"
          y="-306"
          textAnchor="middle"
          fontSize="16"
          letterSpacing="3"
          fill="#C9A227"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          #2
        </text>
      </g>
    </svg>
  );
}
