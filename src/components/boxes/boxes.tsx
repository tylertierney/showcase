import React, { useEffect, useRef, useState, type RefObject } from 'react'
import { Button } from '../ui/button'
import {
  type Coords,
  type Line,
  Box,
  convertLinesToPath,
  distance,
} from './utils'
import { Showcase } from '../animated-svg/arrow/arrow'
import { toast } from 'sonner'

const WIDTH = 600
const HEIGHT = 600

type CoordsWithOffset = Coords & { offsetX: number; offsetY: number }

type LinesConfig = {
  source: Box
  target: Box
  offset?: number
  diagonal?: boolean
}

const getLines = ({
  source,
  target,
  offset = 20,
  diagonal = false,
}: LinesConfig): Line[] => {
  const offsets: { offsetX: number; offsetY: number }[] = [
    { offsetX: 0, offsetY: -1 * offset },
    { offsetX: offset, offsetY: 0 },
    { offsetX: 0, offsetY: offset },
    { offsetX: -1 * offset, offsetY: 0 },
  ]

  const points: CoordsWithOffset[] = [
    source.top,
    source.right,
    source.bottom,
    source.left,
  ].map((p, i) => ({
    x: p.x,
    y: p.y,
    offsetX: p.x + offsets[i].offsetX,
    offsetY: p.y + offsets[i].offsetY,
  }))

  const targetPoints: CoordsWithOffset[] = [
    target.top,
    target.right,
    target.bottom,
    target.left,
  ].map((p, i) => ({
    x: p.x,
    y: p.y,
    offsetX: p.x + offsets[i].offsetX,
    offsetY: p.y + offsets[i].offsetY,
  }))

  let minDist = Infinity
  let closestPair: [CoordsWithOffset, CoordsWithOffset] = [
    points[0],
    targetPoints[0],
  ]

  for (const p1 of points) {
    for (const p2 of targetPoints) {
      const dist = distance({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y })
      if (dist < minDist) {
        minDist = dist
        closestPair = [p1, p2]
      }
    }
  }

  const [sourcePt, targetPt] = closestPair

  if (minDist < 4 * offset) {
    return [
      {
        x1: sourcePt.x,
        y1: sourcePt.y,
        x2: targetPt.x,
        y2: targetPt.y,
      },
    ]
  }

  if (diagonal) {
    return [
      {
        x1: sourcePt.x,
        y1: sourcePt.y,
        x2: sourcePt.offsetX,
        y2: sourcePt.offsetY,
      },
      {
        x1: sourcePt.offsetX,
        y1: sourcePt.offsetY,
        x2: targetPt.offsetX,
        y2: targetPt.offsetY,
      },
      {
        x1: targetPt.offsetX,
        y1: targetPt.offsetY,
        x2: targetPt.x,
        y2: targetPt.y,
      },
    ]
  }

  return [
    {
      x1: sourcePt.x,
      y1: sourcePt.y,
      x2: sourcePt.offsetX,
      y2: sourcePt.offsetY,
    },
    {
      x1: sourcePt.offsetX,
      y1: sourcePt.offsetY,
      x2: targetPt.offsetX,
      y2: sourcePt.offsetY,
    },
    {
      x1: targetPt.offsetX,
      y1: sourcePt.offsetY,
      x2: targetPt.offsetX,
      y2: targetPt.offsetY,
    },
    {
      x1: targetPt.offsetX,
      y1: targetPt.offsetY,
      x2: targetPt.x,
      y2: targetPt.y,
    },
  ]
}

const getBoxes = (): Box[] =>
  Array(4)
    .fill(null)
    .map(
      () =>
        new Box({
          x: ~~(Math.random() * (WIDTH - 100)) + 20,
          y: ~~(Math.random() * (HEIGHT - 100)) + 20,
          width: 65,
          height: 65,
        }),
    )

type Drag = {
  box: Box
  x: number
  y: number
  offsetX: number
  offsetY: number
}

export const Boxes = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [boxes, setBoxes] = useState<Box[]>(getBoxes)

  useEffect(() => {
    const cb = () => setDrag(null)

    window.addEventListener('pointerup', cb)

    return () => window.removeEventListener('pointerup', cb)
  }, [])

  const onPointerDown = (e: React.PointerEvent, box: Box) => {
    const curr = svgRef.current
    if (!curr) return

    const { top, left, width, height } = curr.getBoundingClientRect()

    const x = ((e.clientX - left) / width) * WIDTH
    const y = ((e.clientY - top) / height) * HEIGHT

    const res: Drag = {
      box,
      x,
      y,
      offsetX: x - box.x,
      offsetY: y - box.y,
    }

    setDrag(res)
  }

  useEffect(() => {
    const cb = (e: PointerEvent) => {
      if (!drag) return
      const curr = svgRef.current
      if (!curr) return

      const { top, left, width, height } = curr.getBoundingClientRect()

      setBoxes((prev) =>
        prev.map((b) => {
          if (b.id === drag.box.id) {
            return new Box({
              ...b,
              x: ((e.clientX - left) / width) * WIDTH - drag.offsetX,
              y: ((e.clientY - top) / height) * HEIGHT - drag.offsetY,
            })
          }
          return b
        }),
      )
    }

    window.addEventListener('pointermove', cb)

    return () => window.removeEventListener('pointermove', cb)
  }, [drag])

  const rowCount = ~~(HEIGHT / 30)
  const colCount = ~~(WIDTH / 30)
  const dots = () =>
    Array(rowCount + 1)
      .fill(null)
      .map((_, r) =>
        Array(colCount + 1)
          .fill(null)
          .map((_, c) => (
            <circle
              key={r * rowCount + c}
              cx={c * 30}
              cy={r * 30}
              r={1}
              fill="url(#bg-gradient)"
              opacity={1}
            />
          )),
      )

  const copy = (ref: RefObject<SVGSVGElement | null>) => {
    if (!ref) return
    const curr = ref.current
    if (!curr) return

    const html = curr.outerHTML

    navigator.clipboard.writeText(html)
  }

  return (
    <div className="flex flex-col gap-12 pt-36 container">
      <Button
        className="self-center py-4 px-8"
        onClick={() => setBoxes([...getBoxes(), ...getBoxes()])}
      >
        Reset
      </Button>
      <Showcase />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{
          height: 'min(600px, 100vw)',
          touchAction: 'none',
        }}
        className="self-center"
      >
        <linearGradient
          id="bg-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--foreground)">
            <animate
              attributeName="stop-color"
              values="var(--foreground);var(--foreground-50);var(--foreground-50);var(--foreground)"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="var(--foreground)">
            <animate
              attributeName="stop-color"
              values="var(--foreground-50);var(--foreground);var(--foreground-50);var(--foreground-50)"
              dur="4s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="100%" stopColor="var(--foreground)">
            <animate
              attributeName="stop-color"
              values="var(--foreground-50);var(--foreground-50);var(--foreground);var(--foreground-50)"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
        {dots()}
        {boxes.slice(1).map((box, idx) => {
          const prev = boxes[idx]

          const lines = getLines({ source: box, target: prev })

          return (
            <path
              key={idx}
              d={convertLinesToPath(lines, 5)}
              fill="none"
              strokeWidth={1}
              // stroke="var(--foreground)"
              stroke="url(#bg-gradient)"
              strokeLinejoin="round"
              strokeDasharray={'6'}
            />
          )
        })}
        {boxes.map((box, key) => {
          return (
            <g
              key={key}
              style={{ cursor: drag ? 'grabbing' : 'grab' }}
              onPointerDown={(e) => onPointerDown(e, box)}
            >
              <rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                fill="var(--background)"
                // stroke="var(--foreground)"
                stroke="url(#bg-gradient)"
                rx={6}
              ></rect>
            </g>
          )
        })}
      </svg>
      <Button
        className="self-center py-4 px-8"
        onClick={() => {
          try {
            copy(svgRef)
            toast.success('Copied to clipboard!', { position: 'top-center' })
          } catch {
            toast.error('Something went wrong', { position: 'top-center' })
          }
        }}
      >
        Copy SVG to clipboard
      </Button>
    </div>
  )
}
