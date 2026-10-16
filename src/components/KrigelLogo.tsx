import { useId } from "react";

// Beautiful custom representation of the Krigel brand monogram logo as shown in the upload reference
export default function KrigelLogo({ className = "w-12 h-12", light = false }: { className?: string; light?: boolean }) {
  const uniqueId = useId().replace(/:/g, "");
  const goldId = `krigelGold-${uniqueId}`;
  const creamId = `krigelCream-${uniqueId}`;
  const leafId = `krigelLeaf-${uniqueId}`;

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Shiny metallic gold gradient for the border, stem, leaves, and divider */}
        <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E7C9" />
          <stop offset="30%" stopColor="#C9AA67" />
          <stop offset="70%" stopColor="#A1824A" />
          <stop offset="100%" stopColor="#C9AA67" />
        </linearGradient>
        {/* Warm cream/soft white gradient for the serif 'K' and brand name */}
        <linearGradient id={creamId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F3E9DD" />
        </linearGradient>
        {/* Elegant reusable leaf template for pristine geometric symmetry */}
        <g id={leafId}>
          {/* Elegant organic pointed leaf shape */}
          <path d="M 0 0 C 3 -6, 14 -8, 22 0 C 14 6, 3 4, 0 0 Z" fill={`url(#${goldId})`} />
          {/* Subtle curved midrib/vein for 3D depth */}
          <path d="M 0 0 Q 11 -1 18 0" stroke="#FFFFFF" strokeWidth="0.4" opacity="0.35" fill="none" />
        </g>
      </defs>

      {/* Main forest green circular badge background */}
      <circle cx="100" cy="100" r="95" fill="#1B322C" />
      
      {/* Outer gold-rimmed double borders matching the real badge exactly */}
      <circle cx="100" cy="100" r="94" stroke={`url(#${goldId})`} strokeWidth="2.5" fill="none" />
      <circle cx="100" cy="100" r="90" stroke={`url(#${goldId})`} strokeWidth="0.75" fill="none" opacity="0.6" />

      {/* Elegant Serif 'K' - Left Vertical Stem with bracketed serifs */}
      <path 
        d="M 60 44 L 92 44 L 92 47 C 86 47, 84 49, 84 54 L 84 106 C 84 111, 86 113, 92 113 L 92 116 L 60 116 L 60 113 C 66 113, 68 111, 68 106 L 68 54 C 68 49, 66 47, 60 47 Z" 
        fill={`url(#${creamId})`} 
      />
      
      {/* Elegant Serif 'K' - Top Right Diagonal Arm */}
      <path 
        d="M 84 74 L 119 44 L 133 44 L 133 47 C 128 47, 126 49, 125 52 L 91 82 Z" 
        fill={`url(#${creamId})`} 
      />
      
      {/* Elegant Serif 'K' - Bottom Right Diagonal Leg with wide flared foot */}
      <path 
        d="M 97 76 L 113 113 C 113 113, 109 113, 107 113 L 107 116 L 140 116 L 140 113 C 133 113, 127 107, 121 98 L 103 76 Z" 
        fill={`url(#${creamId})`} 
      />

      {/* The golden olive/laurel branch cutting across the monogram */}
      <path 
        d="M 55 126 Q 101 92 147 44" 
        stroke={`url(#${goldId})`} 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Symmetrical & organic golden leaves sprouting sequentially along the stem */}
      {/* Terminal leaf at the tip */}
      <use href={`#${leafId}`} transform="translate(147, 44) rotate(-48) scale(1.0)" />

      {/* Pair 1: t = 0.88 */}
      <use href={`#${leafId}`} transform="translate(136, 55.3) rotate(-78) scale(0.92)" />
      <use href={`#${leafId}`} transform="translate(136, 55.3) rotate(-14) scale(0.92)" />

      {/* Pair 2: t = 0.76 */}
      <use href={`#${leafId}`} transform="translate(125, 66.2) rotate(-79) scale(0.82)" />
      <use href={`#${leafId}`} transform="translate(125, 66.2) rotate(-11) scale(0.82)" />

      {/* Pair 3: t = 0.64 */}
      <use href={`#${leafId}`} transform="translate(114, 76.7) rotate(-79) scale(0.72)" />
      <use href={`#${leafId}`} transform="translate(114, 76.7) rotate(-7) scale(0.72)" />

      {/* Pair 4: t = 0.52 */}
      <use href={`#${leafId}`} transform="translate(103, 86.9) rotate(-79) scale(0.62)" />
      <use href={`#${leafId}`} transform="translate(103, 86.9) rotate(-3) scale(0.62)" />

      {/* Brand Name "תומר קריגל" */}
      <text 
        x="100" 
        y="143" 
        fontFamily="Inter, system-ui, -apple-system, sans-serif" 
        fontWeight="800" 
        fontSize="14.5" 
        fill={`url(#${creamId})`} 
        textAnchor="middle" 
        letterSpacing="0.5"
      >
        תומר קריגל
      </text>

      {/* Dynamic Separator with Gold Diamond */}
      <path d="M 45 153 L 90 153 M 110 153 L 155 153" stroke={`url(#${goldId})`} strokeWidth="0.8" />
      <polygon points="100,150 103,153 100,156 97,153" fill={`url(#${goldId})`} />

      {/* Tagline "תכנון נכון, עתיד בטוח" */}
      <text 
        x="100" 
        y="169" 
        fontFamily="Inter, system-ui, -apple-system, sans-serif" 
        fontWeight="700" 
        fontSize="7.5" 
        fill={`url(#${goldId})`} 
        textAnchor="middle" 
        letterSpacing="1"
      >
        תכנון נכון, עתיד בטוח
      </text>
    </svg>
  );
}
