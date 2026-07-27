import type {  SVGProps  } from "react"
const ShortPath = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 427 281"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 207.465C66.5772 282.42 194.227 318.364 208.244 220.177C223.276 114.878 124.145 -13.4553 259.804 2.32473C368.332 14.9488 418.992 111.47 426 140.4"
      stroke="var(--text-primary)"
      strokeOpacity={0.36}
      style={{
        stroke: "var(--text-primary)",
        strokeOpacity: 0.36,
      }}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="2 8"
    />
  </svg>
)
export { ShortPath as ReactComponent }
