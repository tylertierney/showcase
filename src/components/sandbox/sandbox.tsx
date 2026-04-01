/* eslint-disable react-hooks/purity */

import { useEffect, useReducer, useRef, useState, type MouseEvent } from 'react'
import { Button } from '../ui/button'

type Coords = {
  x: number
  y: number
}

class Box {
  id: string
  x: number
  y: number
  width: number
  height: number
  constructor(box: Coords & { width: number; height: number; id?: string }) {
    this.id = box.id ? box.id : String(~~(Math.random() * 1_000_000_000))
    this.x = box.x
    this.y = box.y
    this.width = box.width
    this.height = box.height
  }

  get cx() {
    return this.x + this.width / 2
  }

  get cy() {
    return this.y + this.height / 2
  }

  get center() {
    return {
      x: this.cx,
      y: this.cy,
    }
  }

  get top() {
    return {
      x: this.x + this.width / 2,
      y: this.y,
    }
  }

  get right() {
    return {
      x: this.x + this.width,
      y: this.y + this.height / 2,
    }
  }

  get bottom() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height,
    }
  }

  get left() {
    return {
      x: this.x,
      y: this.y + this.height / 2,
    }
  }
}

type CoordsWithOffset = Coords & { offsetX: number; offsetY: number }

const getLines = (
  source: Box,
  target: Box,
  offset?: number,
): Array<{ x1: number; y1: number; x2: number; y2: number }> => {
  const _offset = offset || 20
  const offsets: { offsetX: number; offsetY: number }[] = [
    { offsetX: 0, offsetY: -1 * _offset },
    { offsetX: _offset, offsetY: 0 },
    { offsetX: 0, offsetY: _offset },
    { offsetX: -1 * _offset, offsetY: 0 },
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
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
      if (dist < minDist) {
        minDist = dist
        closestPair = [p1, p2]
      }
    }
  }

  if (minDist < 3 * _offset) {
    return [
      {
        x1: closestPair[0].x,
        y1: closestPair[0].y,
        x2: closestPair[1].x,
        y2: closestPair[1].y,
      },
    ]
  }

  // with diagonals
  // return [
  //   {
  //     x1: closestPair[0].x,
  //     y1: closestPair[0].y,
  //     x2: closestPair[0].offsetX,
  //     y2: closestPair[0].offsetY,
  //   },
  //   {
  //     x1: closestPair[0].offsetX,
  //     y1: closestPair[0].offsetY,
  //     x2: closestPair[1].offsetX,
  //     y2: closestPair[1].offsetY,
  //   },
  //   {
  //     x1: closestPair[1].offsetX,
  //     y1: closestPair[1].offsetY,
  //     x2: closestPair[1].x,
  //     y2: closestPair[1].y,
  //   },
  // ]

  return [
    {
      x1: closestPair[0].x,
      y1: closestPair[0].y,
      x2: closestPair[0].offsetX,
      y2: closestPair[0].offsetY,
    },
    {
      x1: closestPair[0].offsetX,
      y1: closestPair[0].offsetY,
      x2: closestPair[1].offsetX,
      y2: closestPair[0].offsetY,
    },
    {
      x1: closestPair[1].offsetX,
      y1: closestPair[0].offsetY,
      x2: closestPair[1].offsetX,
      y2: closestPair[1].offsetY,
    },
    {
      x1: closestPair[1].offsetX,
      y1: closestPair[1].offsetY,
      x2: closestPair[1].x,
      y2: closestPair[1].y,
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
          // width: ~~(Math.random() * 50) + 30,
          // height: ~~(Math.random() * 50) + 30,
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

export const Sandbox = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [boxes, setBoxes] = useState<Box[]>(getBoxes)

  useEffect(() => {
    const cb = () => setDrag(null)

    window.addEventListener('mouseup', cb)

    return () => window.removeEventListener('mouseup', cb)
  }, [])

  const onMouseDown = (e: MouseEvent, box: Box) => {
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

  const onMouseMove = (e: MouseEvent) => {
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

  return (
    <div className="flex flex-col gap-12 pt-36">
      <Button onClick={() => setBoxes(getBoxes())}>reset</Button>
      <svg
        onMouseMove={onMouseMove}
        ref={svgRef}
        viewBox="0 0 500 500"
        style={{ border: 'solid red 1px', width: '500px' }}
      >
        {boxes.slice(1).map((box, idx) => {
          const prev = boxes[idx]

          const lines = getLines(box, prev)

          return lines.map(({ x1, y1, x2, y2 }, key) => (
            <line
              key={key}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="black"
              strokeWidth={2}
              strokeLinecap="round"
            />
          ))
        })}
        {boxes.map((box, key) => {
          // const { x, y, width, height } = box

          return (
            <g
              key={key}
              style={{ cursor: drag ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => onMouseDown(e, box)}
            >
              <rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                fill="lightblue"
              ></rect>
              {/* {[box.center, box.top, box.right, box.bottom, box.left].map(
                ({ x, y }, key) => {
                  return <circle key={key} cx={x} cy={y} r={5} fill="red" />
                },
              )} */}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
