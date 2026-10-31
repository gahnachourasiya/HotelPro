import { useState } from "react";

// Shows frontend/public/auth-illustration.png when that file exists
// (drop the illustration from your reference project there).
// Otherwise it falls back to the simple drawing below.
export default function AuthIllustration() {
  const [missing, setMissing] = useState(false);

  if (!missing) {
    return (
      <img
        className="auth-img"
        src="/auth-illustration.png"
        alt=""
        onError={() => setMissing(true)}
      />
    );
  }

  return (
    <svg
      className="auth-svg"
      viewBox="0 0 600 520"
      role="img"
      aria-label="A booking form on a computer screen"
    >
      <ellipse cx="110" cy="380" rx="85" ry="110" fill="#bcd3ff" />
      <ellipse cx="525" cy="300" rx="62" ry="92" fill="#cfe0ff" />
      <circle cx="92" cy="120" r="34" fill="#e3ecff" />
      <circle cx="505" cy="110" r="22" fill="#e3ecff" />

      <rect x="105" y="105" width="390" height="280" rx="10" fill="#e6e8ec" />
      <rect x="119" y="119" width="362" height="246" rx="4" fill="#ffffff" />
      <rect x="262" y="385" width="76" height="46" fill="#d4d7dd" />
      <rect x="205" y="429" width="190" height="14" rx="7" fill="#3b82f6" />

      <g transform="rotate(-7 300 240)">
        <rect x="190" y="150" width="220" height="180" rx="6" fill="#1f2a6b" />
        <rect x="212" y="176" width="110" height="10" rx="5" fill="#8ea2ff" />
        <rect x="212" y="204" width="176" height="10" rx="5" fill="#ffffff" fillOpacity="0.85" />
        <rect x="212" y="228" width="176" height="10" rx="5" fill="#ffffff" fillOpacity="0.85" />
        <rect x="212" y="252" width="130" height="10" rx="5" fill="#ffffff" fillOpacity="0.85" />
        <rect x="212" y="286" width="70" height="22" rx="4" fill="#3b82f6" />
      </g>

      <g transform="rotate(38 400 250)">
        <rect x="392" y="130" width="16" height="130" rx="8" fill="#e5484d" />
        <polygon points="392,260 408,260 400,288" fill="#1f2a6b" />
        <rect x="392" y="130" width="16" height="22" rx="8" fill="#b83237" />
      </g>

      <circle cx="162" cy="152" r="5" fill="#ff8a8a" />
      <circle cx="180" cy="152" r="5" fill="#ffd166" />
      <circle cx="198" cy="152" r="5" fill="#7bd88f" />
    </svg>
  );
}
