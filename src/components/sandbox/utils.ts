export type Coords = {
  x: number
  y: number
}

export type Line = {
  x1: number
  y1: number
  x2: number
  y2: number
}

export class Box {
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

export const distance = (line: Line) => {
  const { x1, y1, x2, y2 } = line
  return Math.hypot(x2 - x1, y2 - y1)
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const trimPoint = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  trim: number,
) => {
  const len = distance({ x1, y1, x2, y2 })
  const t = Math.max(0, Math.min(1, (len - trim) / len))
  return {
    x: lerp(x1, x2, t),
    y: lerp(y1, y2, t),
  }
}

export const trimStart = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  trim: number,
) => {
  const len = distance({ x1, y1, x2, y2 })
  const t = Math.max(0, Math.min(1, trim / len))
  return {
    x: lerp(x1, x2, t),
    y: lerp(y1, y2, t),
  }
}

export const convertLinesToPath = (lines: Line[], radius = 10): string => {
  if (!lines.length) return ''

  let d = ''

  // Move to first point
  d += `M ${lines[0].x1} ${lines[0].y1}`

  for (let i = 0; i < lines.length; i++) {
    const curr = lines[i]
    const next = lines[i + 1]

    if (!next) {
      // Last segment: just line to end
      d += ` L ${curr.x2} ${curr.y2}`
      continue
    }

    // Trim end of current line
    const endTrimmed = trimPoint(curr.x1, curr.y1, curr.x2, curr.y2, radius)

    // Trim start of next line
    const startTrimmed = trimStart(next.x1, next.y1, next.x2, next.y2, radius)

    // Line to trimmed end
    d += ` L ${endTrimmed.x} ${endTrimmed.y}`

    // Quadratic curve through corner point
    d += ` Q ${curr.x2} ${curr.y2} ${startTrimmed.x} ${startTrimmed.y}`
  }

  return d
}
