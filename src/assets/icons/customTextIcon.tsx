import type { SVGProps } from "react";
const customTextIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.21443 10.5C5.07157 10.5 3.35728 10.5 3.35728 8.35714M3.35728 8.35714V7.5M3.35728 8.35714C3.35728 9.78571 1.64286 10.5 0.5 10.5M3.35728 2.64286C3.35728 1.21429 5.07157 0.5 6.21443 0.5M3.35728 2.64286V5.5M3.35728 2.64286C3.35728 0.5 1.64286 0.5 0.5 0.5M1.49944 5.5H5.49944"
      stroke="var(--cursor-text-stroke, black)"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      style={{
        stroke: "var(--cursor-text-stroke, black)",
      }}
      strokeLinecap="round"
    />
  </svg>
)
export { customTextIcon };
