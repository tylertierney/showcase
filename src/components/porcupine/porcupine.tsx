import {
  type CSSProperties,
  type MouseEvent,
  type MouseEventHandler,
  type SVGAttributes,
  useEffect,
  useMemo,
  useState,
} from 'react'

const fallbackStemGradient = ['var(--foreground)']

type Coords = {
  x: number
  y: number
}

const getRandomPointInCircle = (
  radius: number,
  cx: number,
  cy: number,
): Coords => {
  const angle = Math.random() * 2 * Math.PI
  const r = Math.sqrt(Math.random()) * 0.9 * radius

  const x = cx + r * Math.cos(angle)
  const y = cy + r * Math.sin(angle)
  return { x, y }
}

type Node = Coords & {
  seed: number
  style?: CSSProperties
}

type PorcupineProps = {
  numberOfNodes?: number
  /**
   * @default 600
   */
  viewBoxWidth?: number
  /**
   * @default 600
   */
  viewBoxHeight?: number
  stemGradient?: string[]
  backgroundGradient?: string[]
}

const HEIGHT = 600
const WIDTH = 600

const getInitialNodes = (
  numberOfNodes: number,
  width: number,
  height: number,
) => {
  return Array(numberOfNodes)
    .fill(null)
    .map(() => {
      // const { x, y } = getRandomSemicirclePoints(HEIGHT / 1.4, WIDTH / 2, HEIGHT)
      const { x, y } = getRandomPointInCircle(width / 2, width / 2, height / 2)
      // const x = Math.random() * WIDTH
      // const y = Math.random() * HEIGHT
      return {
        x,
        y,
        seed: Math.random() * 1000,
      }
    })
}

export default function Porcupine({
  numberOfNodes = 500,
  viewBoxWidth = 600,
  viewBoxHeight = 600,
  stemGradient = [],
  backgroundGradient = [],
  ...rest
}: PorcupineProps & SVGAttributes<SVGSVGElement>) {
  const initialNodes: Node[] = useMemo(
    () => getInitialNodes(numberOfNodes, 600, 600),
    [numberOfNodes],
  )

  // const initialNodes: Node[] = getInitialNodes(numberOfNodes, 600, 600)

  const [time, setTime] = useState(0)

  useEffect(() => {
    let raf: number

    const tick = () => {
      setTime((t) => t + 0.0075)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [])

  const [coords, setCoords] = useState<Coords>({ x: 0, y: 0 })

  const onMouseMove = ((e: MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    const { top, left, width, height } = rect

    const xPixelValue = e.clientX - left
    const yPixelValue = e.clientY - top

    const x = (xPixelValue / width) * viewBoxWidth
    const y = (yPixelValue / height) * viewBoxHeight

    setCoords({ x, y })
  }) as MouseEventHandler<SVGSVGElement>

  const nodes: Node[] = initialNodes.map(({ x, y, seed }) => {
    const mouseX = coords.x
    const mouseY = coords.y

    // Drift
    const driftRadius = 15
    const driftX = Math.cos(time + seed) * driftRadius
    const driftY = Math.sin(time + seed) * driftRadius

    let finalX: number = x + driftX
    let finalY: number = y + driftY

    // Mouse push
    const dx = finalX - mouseX
    const dy = finalY - mouseY

    const distance = Math.sqrt(dx * dx + dy * dy)
    const radius = 120

    if (distance < radius && distance !== 0) {
      // Normalize direction (unit vector)
      const nx = dx / distance
      const ny = dy / distance

      // Strength falls off as distance increases
      const force = (radius - distance) / radius

      // Push away from mouse
      const pushStrength = 40 // tweak this

      finalX += nx * force * pushStrength
      finalY += ny * force * pushStrength

      return { x: finalX, y: finalY, seed }
    }

    return { x: finalX, y: finalY, seed }
  })

  const _stemGradient = stemGradient.length
    ? stemGradient
    : fallbackStemGradient

  return (
    <svg
      className="svg"
      onMouseMove={onMouseMove}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      {...rest}
    >
      <defs>
        <radialGradient
          className=""
          id="stem-gradient"
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={'50%'}
          x2={0}
          y2={'100%'}
        >
          {_stemGradient.map((color, key) => (
            <stop
              key={`${color}-${key}`}
              offset={(1 / _stemGradient.length) * key}
              style={{ stopColor: color }}
            />
          ))}
        </radialGradient>
        {backgroundGradient.length && (
          <radialGradient id="background-gradient">
            {backgroundGradient.map((color, key) => (
              <stop
                key={`${color}-${key}`}
                offset={(1 / backgroundGradient.length) * key}
                style={{ stopColor: color }}
              />
            ))}
            <stop offset={1} style={{ stopColor: 'var(--background)' }} />
          </radialGradient>
        )}
      </defs>
      <rect
        x={0}
        y={0}
        height={HEIGHT}
        width={WIDTH}
        fill="url(#background-gradient)"
        style={{ opacity: 0.75 }}
      />
      {nodes.map(({ x, y, style = {} }, key) => (
        <g key={key}>
          <circle
            cx={x}
            cy={y}
            r={1.9}
            style={{ fill: 'url(#stem-gradient)', ...style }}
          />
          <line
            key={key}
            x1={x}
            y1={y}
            x2={WIDTH / 2}
            y2={HEIGHT / 2}
            style={{
              stroke: 'url(#stem-gradient)',
              opacity: 1,
              strokeLinecap: 'round',
              strokeWidth: 0.5,
            }}
          ></line>
        </g>
      ))}
    </svg>
  )
}
