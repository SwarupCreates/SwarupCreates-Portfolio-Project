import type { SVGProps } from "react";
const customCursorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.24708 13.7675L0.572723 1.86913C0.253398 1.0563 1.0563 0.253398 1.86913 0.572723L13.7675 5.24708C14.6482 5.59307 14.6003 6.85534 13.6959 7.13361L9.18368 8.52199C8.86716 8.61938 8.61938 8.86716 8.52199 9.18368L7.13361 13.6959C6.85534 14.6003 5.59307 14.6482 5.24708 13.7675Z"
      fill="var(--cursor-arrow-fill, #89CAFF)"
      stroke="var(--cursor-arrow-stroke, black)"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      style={{
        fill: "var(--cursor-arrow-fill, #89CAFF)",
        stroke: "var(--cursor-arrow-stroke, black)",
        strokeWidth: 2,
      }}
    />
  </svg>
)
export { customCursorIcon };
