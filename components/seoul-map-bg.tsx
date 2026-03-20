export function SeoulMapBg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Seoul Districts Outline - Simplified stylized version */}
      <g stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4">
        {/* Main Seoul outline */}
        <path d="M80 120 Q120 80, 200 70 Q280 60, 320 100 Q360 140, 350 200 Q340 260, 320 300 Q300 340, 260 380 Q220 420, 160 400 Q100 380, 70 320 Q40 260, 50 200 Q60 140, 80 120 Z" />
        
        {/* District divisions */}
        <path d="M200 70 L200 200 L160 280" />
        <path d="M200 200 L280 220" />
        <path d="M160 280 L100 300" />
        <path d="M200 200 L220 300" />
        <path d="M280 220 L300 300" />
        <path d="M120 180 L200 200" />
        <path d="M200 200 L240 140" />
        
        {/* Han River */}
        <path d="M40 240 Q100 260, 160 250 Q220 240, 280 250 Q340 260, 380 250" strokeWidth="2" opacity="0.3" />
        
        {/* Secondary roads */}
        <path d="M100 150 L150 200 L100 260" strokeWidth="0.3" opacity="0.2" />
        <path d="M280 140 L250 200 L290 270" strokeWidth="0.3" opacity="0.2" />
        <path d="M180 320 L200 380" strokeWidth="0.3" opacity="0.2" />
        <path d="M240 320 L260 370" strokeWidth="0.3" opacity="0.2" />
      </g>
      
      {/* District labels - very subtle */}
      <g fill="currentColor" opacity="0.15" fontSize="8" fontFamily="sans-serif">
        <text x="170" y="130">강북</text>
        <text x="250" y="150">도봉</text>
        <text x="100" y="180">은평</text>
        <text x="200" y="190">종로</text>
        <text x="280" y="200">성북</text>
        <text x="130" y="230">마포</text>
        <text x="200" y="230">중구</text>
        <text x="260" y="240">성동</text>
        <text x="100" y="290">영등포</text>
        <text x="170" y="300">용산</text>
        <text x="230" y="290">강남</text>
        <text x="290" y="300">송파</text>
        <text x="150" y="360">관악</text>
        <text x="220" y="370">서초</text>
      </g>
      
      {/* Subtle grid pattern */}
      <g stroke="currentColor" strokeWidth="0.2" opacity="0.1">
        {[...Array(10)].map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={50 + i * 45} x2="400" y2={50 + i * 45} />
        ))}
        {[...Array(10)].map((_, i) => (
          <line key={`v-${i}`} x1={40 + i * 40} y1="0" x2={40 + i * 40} y2="500" />
        ))}
      </g>
    </svg>
  )
}
