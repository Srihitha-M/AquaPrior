
export default function ContourLines() {
  return (
    <svg
      className="contours"
      viewBox="0 0 1200 260"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        <path d="M0 40 C 150 10, 300 90, 470 50 S 800 0, 960 40 S 1130 80, 1200 30" opacity="0.30" />
        <path d="M0 70 C 160 40, 310 120, 480 82 S 810 30, 970 72 S 1140 110, 1200 62" opacity="0.38" />
        <path d="M0 100 C 170 72, 320 150, 490 114 S 820 62, 980 104 S 1150 138, 1200 96" opacity="0.46" />
        <path d="M0 130 C 180 104, 330 178, 500 146 S 830 96, 990 136 S 1160 166, 1200 128" opacity="0.54" />
        <path d="M0 160 C 190 136, 340 206, 510 178 S 840 130, 1000 168 S 1170 194, 1200 160" opacity="0.46" />
        <path d="M0 190 C 200 168, 350 232, 520 210 S 850 164, 1010 200 S 1180 222, 1200 192" opacity="0.38" />
        <path d="M0 220 C 210 200, 360 258, 530 242 S 860 198, 1020 232 S 1190 250, 1200 224" opacity="0.30" />

        <path d="M820 150 C 840 110, 920 96, 970 120 C 1020 144, 1010 196, 950 206 C 890 216, 800 192, 820 150 Z" opacity="0.5" />
        <path d="M856 152 C 868 128, 920 118, 950 134 C 982 150, 976 182, 940 188 C 902 194, 846 178, 856 152 Z" opacity="0.5" />
      </g>
    </svg>
  );
}
