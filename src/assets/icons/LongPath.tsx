import type {  SVGProps  } from "react"
const LongPath = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1692 365"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 176.367C284.038 534.154 742.155 298.689 776 128.441C809 -37.5597 616.128 -37.4935 609 105.94C603.492 216.784 697.55 357.744 928.5 349.94C1269.18 338.429 1344 110.94 1690.5 197.44"
      stroke="var(--text-primary)"
      strokeOpacity={0.36}
      style={{
        stroke: "var(--text-primary)",
        strokeOpacity: 0.36,
      }}
      strokeWidth={2}
      strokeLinecap="round"
      strokeDasharray="2 12"
    />
  </svg>
)
export { LongPath as ReactComponent }
