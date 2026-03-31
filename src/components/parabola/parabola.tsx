import { forwardRef, type Ref, type ReactNode, type SVGAttributes } from 'react'

export type Point = {
  x: number
  y: number
}

export type ParabolaArgs = {
  minX: number
  maxX: number
  step: number
  a: number
  h: number
  k: number
}

function generateParabolaPoints(args: ParabolaArgs): Point[] {
  const { minX, maxX, step, a, h, k } = args

  const points: Point[] = []

  for (let x = minX; x <= maxX; x += step) {
    const y = a * Math.pow(x - h, 2) + k
    points.push({ x, y })
  }

  return points
}

export type ParabolaProps = {
  args: ParabolaArgs
  pointEl?: (point: Point, key: number | string) => ReactNode
} & SVGAttributes<SVGSVGElement>

export const Parabola = forwardRef<SVGSVGElement, ParabolaProps>(
  (
    {
      args,
      pointEl = ({ x, y }, key) => <circle key={key} cx={x} cy={y} r="1" />,
      ...rest
    },
    ref,
  ) => {
    const points = generateParabolaPoints(args)

    return (
      <svg
        ref={ref as Ref<SVGSVGElement>}
        viewBox="-100 -100 200 200"
        xmlns="http://www.w3.org/2000/svg"
        width={500}
        height={500}
        {...rest}
      >
        <defs>
          {/* <linearGradient
          id="grad1"
          gradientUnits="userSpaceOnUse"
          x1="-50"
          y1="0"
          x2="50"
          y2="0"
        > */}
          <linearGradient
            id="grad1"
            gradientUnits="userSpaceOnUse"
            x1="-50"
            y1="0"
            x2="50"
            y2="0"
          >
            <stop offset="0%" stop-color="blue" />
            <stop offset="100%" stop-color="red" />
          </linearGradient>
        </defs>
        {/* <circle cx="0" cy="0" r="5" fill="blue" /> */}
        {points.map(({ x, y }, key) => pointEl({ x, y }, key))}
      </svg>
    )
  },
)

export default Parabola
