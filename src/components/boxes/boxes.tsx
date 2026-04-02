import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import {
  type Coords,
  type Line,
  Box,
  convertLinesToPath,
  distance,
} from './utils'

const WIDTH = 500
const HEIGHT = 500

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
          x: ~~(Math.random() * 380) + 10,
          y: ~~(Math.random() * 380) + 10,
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

    const { top, left } = curr.getBoundingClientRect()

    const res: Drag = {
      box,
      x: e.clientX - left,
      y: e.clientY - top,
      offsetX: e.clientX - left - box.x,
      offsetY: e.clientY - top - box.y,
    }

    setDrag(res)
  }

  useEffect(() => {
    const cb = (e: PointerEvent) => {
      if (!drag) return
      const curr = svgRef.current
      if (!curr) return

      const { top, left } = curr.getBoundingClientRect()

      setBoxes((prev) =>
        prev.map((b) => {
          if (b.id === drag.box.id) {
            return new Box({
              ...b,
              x: e.clientX - left - drag.offsetX,
              y: e.clientY - top - drag.offsetY,
            })
          }
          return b
        }),
      )
    }

    window.addEventListener('pointermove', cb)

    return () => window.removeEventListener('pointermove', cb)
  }, [drag])

  return (
    <div className="flex flex-col gap-12 pt-36">
      <Button onClick={() => setBoxes(getBoxes())}>reset</Button>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ border: 'solid red 1px', width: '500px', touchAction: 'none' }}
      >
        {boxes.slice(1).map((box, idx) => {
          const prev = boxes[idx]

          const lines = getLines({ source: box, target: prev })

          return (
            <path
              key={idx}
              d={convertLinesToPath(lines, 5)}
              fill="none"
              strokeWidth={1}
              stroke="var(--foreground)"
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
                stroke="var(--foreground)"
                rx={6}
              ></rect>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
