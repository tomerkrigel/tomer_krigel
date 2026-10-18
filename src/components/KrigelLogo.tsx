import { useId } from "react";

// Beautiful custom representation of the Krigel brand monogram logo as shown in the upload reference
export default function KrigelLogo({ className = "w-12 h-12", light = false }: { className?: string; light?: boolean }) {
  const uniqueId = useId().replace(/:/g, "");
  const goldId = `krigelGold-${uniqueId}`;
  const creamId = `krigelCream-${uniqueId}`;
  const leafId = `krigelLeaf-${uniqueId}`;

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
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

      {/* Brand name "תומר קריגל" – outlined from Heebo ExtraBold, so it looks the same on every device */}
      <path fill={`url(#${creamId})`} d="M64.8 136.3V132.1H67.2V134.5H71.1V136.3ZM71.9 136 69.1 143H66.6L70.1 134.5H71.9Z M73 143.1Q72.9 143.1 72.7 143.1Q72.6 143.1 72.4 143.1V140.9Q72.6 140.9 72.8 140.9Q73 141 73.2 141Q73.7 141 74.1 140.8Q74.4 140.7 74.7 140.4Q75 140.1 75.2 139.7V136.3H73.4V134.5H77.6V138.8Q77.6 139.5 77.7 140.2L78.3 143H76.1L75.6 140.9H75.5Q75.4 141.5 75 142Q74.7 142.5 74.2 142.8Q73.7 143.1 73 143.1Z M80.6 139.4V136.3H79.3V134.5H83V139.4Z M88 143V137.4Q88 136.9 87.7 136.6Q87.4 136.3 86.8 136.3H84.3V134.5H87Q88.6 134.5 89.5 135.3Q90.4 136.1 90.4 137.5V143Z M95.6 143V141.2Q96.4 141.1 96.9 140.7Q97.3 140.2 97.3 139.2V136.3H92.4V134.5H99.7V139.2Q99.7 140.4 99.2 141.2Q98.7 142.1 97.8 142.5Q96.9 143 95.6 143ZM92.5 145.9V140.1Q92.5 139.2 92.7 138.8Q92.9 138.3 93 138.2H94.9Q94.9 138.5 94.8 138.9Q94.8 139.3 94.8 139.8V145.9Z M108.4 143V137.4Q108.4 136.9 108.1 136.6Q107.8 136.3 107.2 136.3H104.7V134.5H107.4Q109 134.5 109.9 135.3Q110.8 136.1 110.8 137.5V143Z M112.8 143 113.3 138.3Q113.4 137.8 113.6 137.2Q113.8 136.7 114.1 136.4Q114.1 136.4 114.1 136.4Q114.2 136.4 114.2 136.3V136.3Q113.9 136.4 113.5 136.5Q113.1 136.6 112.9 136.7L112.4 134.9Q113 134.7 113.6 134.6Q114.3 134.4 115.1 134.3Q115.8 134.2 116.5 134.2Q118.5 134.2 119.5 135.3Q120.5 136.3 120.5 138.2V143H116.7V141.1H118.1L118.1 137.9Q118.1 137.1 117.8 136.7Q117.5 136.2 116.9 136.2Q116.3 136.2 116 136.7Q115.7 137.1 115.6 138L115.2 143Z M122.6 143V136.3H121.9V134.5H125V143Z M131.3 134.5Q133 134.5 133.8 135.3Q134.7 136.1 134.7 137.7V143H132.3L132.3 137.5Q132.3 136.9 132 136.6Q131.8 136.3 131.3 136.3H130.2Q130.1 136.7 130.1 137.2Q130.1 137.6 130.1 138V140.3Q130.1 141.7 129.3 142.4Q128.6 143.1 127.4 143.1Q127.1 143.1 126.8 143.1Q126.6 143.1 126.3 143V141.2Q126.4 141.2 126.5 141.2Q126.6 141.2 126.7 141.2Q127.2 141.2 127.5 140.9Q127.7 140.7 127.7 140.2V138.2Q127.7 137.8 127.8 137.3Q127.9 136.7 128.2 136.3H126.9V134.5Z" />

      {/* Dynamic Separator with Gold Diamond */}
      <path d="M 45 153 L 90 153 M 110 153 L 155 153" stroke={`url(#${goldId})`} strokeWidth="0.8" />
      <polygon points="100,150 103,153 100,156 97,153" fill={`url(#${goldId})`} />

      {/* Tagline "תכנון נכון, עתיד בטוח" – outlined from Heebo Bold */}
      <path fill={`url(#${goldId})`} d="M66.5 169 66.5 164.6H68.4Q69.2 164.6 69.7 165Q70.1 165.5 70.1 166.3V169H69L69 166.2Q69 165.8 68.9 165.7Q68.7 165.5 68.4 165.5H67.6L67.6 169Z M71.3 169V165.5H70.9V164.6H72.4V169Z M75.5 169.1Q74.9 169.1 74.5 168.9Q74.1 168.6 73.9 168.2Q73.6 167.8 73.6 167.2V164.6H74.7V167.3Q74.7 167.7 74.9 168Q75.2 168.2 75.5 168.2Q75.9 168.2 76.1 168Q76.3 167.7 76.3 167.3V166.1Q76.3 165.8 76.2 165.6Q76 165.5 75.8 165.5Q75.7 165.5 75.6 165.5Q75.5 165.5 75.4 165.5L75.3 164.8Q75.5 164.7 75.7 164.6Q76 164.6 76.2 164.6Q76.7 164.6 77.1 164.9Q77.4 165.3 77.4 166V167.2Q77.4 167.8 77.2 168.2Q76.9 168.6 76.5 168.9Q76.1 169.1 75.5 169.1Z M78 169V168.1H80.1L81.2 168.1L81.7 168.2V169ZM80.1 168.7V166.2Q80.1 165.8 79.9 165.6Q79.8 165.5 79.4 165.5H78.2V164.6H79.5Q80.3 164.6 80.8 165Q81.2 165.5 81.2 166.2V168.7Z M83.9 164.6H87.7V165.5H86.9V169H85.8V165.5H83.9Z M88.8 167.1V165.5H88.1V164.6H89.9V167.1Z M93.1 164.6Q93.9 164.6 94.4 165Q94.8 165.5 94.8 166.3V169H93.7L93.7 166.2Q93.7 165.8 93.6 165.7Q93.4 165.5 93.1 165.5H92.5Q92.4 165.7 92.4 165.9Q92.4 166.2 92.4 166.4V167.7Q92.4 168.3 92 168.7Q91.7 169.1 91.1 169.1Q90.9 169.1 90.8 169Q90.7 169 90.5 169V168.2Q90.6 168.2 90.6 168.2Q90.7 168.2 90.8 168.2Q91 168.2 91.2 168Q91.3 167.9 91.3 167.6V166.5Q91.3 166.3 91.4 166Q91.4 165.7 91.6 165.5H90.9V164.6Z M97.3 169.1Q96.9 169.1 96.4 169Q96 169 95.5 168.8L95.8 168Q96.1 168.1 96.5 168.2Q96.8 168.3 97.1 168.3Q97.6 168.3 97.9 168Q98.3 167.7 98.3 167.2V164.6H99.4V167.1Q99.4 167.8 99.1 168.2Q98.8 168.7 98.4 168.9Q97.9 169.1 97.3 169.1ZM95.7 164.6H96.8L97.5 167.7Q97.5 167.9 97.6 168.1Q97.7 168.3 97.8 168.4L97 168.4Q96.8 168.3 96.6 168.1Q96.5 167.9 96.4 167.6Z M103.3 168.8Q103.3 169.2 103 169.7Q102.8 170.1 102.5 170.3L102 170.1Q102.1 169.9 102.2 169.7Q102.2 169.5 102.3 169.3Q102.4 169.1 102.4 168.9V168.1H103.3Z M104.4 170.5V165.5H104V164.6H105.4V170.5Z M106.7 169V165.5H106.3V164.6H107.8V169Z M110 169.1Q109.7 169.1 109.3 169Q109 169 108.7 168.9L108.8 168.1Q109.4 168.2 109.8 168.2Q110.4 168.2 110.6 168Q110.9 167.7 110.9 167.3V165.5H108.8V164.6H112V167.1Q112 167.8 111.7 168.2Q111.5 168.7 111 168.9Q110.6 169.1 110 169.1Z M113.6 169.1Q113.4 169.1 113.2 169Q113 169 112.8 169L112.8 168.1Q113.1 168.2 113.3 168.2Q113.6 168.2 113.7 168Q113.8 167.9 113.8 167.6V165.5H113.1V164.6H114.9V167.7Q114.9 168.3 114.6 168.7Q114.2 169.1 113.6 169.1Z M118.1 170.5V165.5H117.7V164.6H119.2V170.5Z M120.5 169V165.5H120.1V164.6H121.6V169Z M123.2 169.1Q123 169.1 122.8 169Q122.6 169 122.4 169L122.4 168.1Q122.7 168.2 122.9 168.2Q123.2 168.2 123.3 168Q123.4 167.9 123.4 167.6V165.5H122.7V164.6H124.5V167.7Q124.5 168.3 124.2 168.7Q123.8 169.1 123.2 169.1Z M126.7 169.1Q126.4 169.1 126.1 169Q125.7 169 125.4 168.9L125.6 168.1Q126.1 168.2 126.5 168.2Q127.1 168.2 127.3 168Q127.6 167.7 127.6 167.3V165.5H125.6V164.6H128.7V167.1Q128.7 167.8 128.4 168.2Q128.2 168.7 127.7 168.9Q127.3 169.1 126.7 169.1Z M131.9 164.6Q132.7 164.6 133.2 165Q133.6 165.5 133.6 166.3V169H132.5L132.5 166.2Q132.5 165.8 132.4 165.7Q132.2 165.5 131.9 165.5H131.3Q131.2 165.7 131.2 165.9Q131.2 166.2 131.2 166.4V167.7Q131.2 168.3 130.8 168.7Q130.5 169.1 129.9 169.1Q129.7 169.1 129.6 169Q129.5 169 129.3 169V168.2Q129.4 168.2 129.4 168.2Q129.5 168.2 129.6 168.2Q129.8 168.2 130 168Q130.1 167.9 130.1 167.6V166.5Q130.1 166.3 130.2 166Q130.2 165.7 130.4 165.5H129.7V164.6Z" />
    </svg>
  );
}
