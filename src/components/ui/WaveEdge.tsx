/** Soft wave that joins one section to the previous one. `color` is the previous section's colour. */
export function WaveEdge({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-x-0 top-0 h-8 w-full sm:h-12"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      style={{ transform: "translateY(-1px)" }}
    >
      <path
        d="M0 0H1440V14C1320 38 1200 42 1080 26C960 10 840 6 720 22C600 38 480 44 360 28C240 12 120 10 0 30Z"
        fill={color}
      />
    </svg>
  );
}
