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
  stemStyle?: CSSProperties
  nodeStyle?: CSSProperties
  size?: number
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
  animated?: boolean
  hover?: boolean
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
      const { x, y } = getRandomPointInCircle(width / 2, width / 2, height / 2)
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
  animated = true,
  hover = true,
  ...rest
}: PorcupineProps & SVGAttributes<SVGSVGElement>) {
  const initialNodes: Node[] = useMemo(
    () => getInitialNodes(numberOfNodes, 600, 600),
    [numberOfNodes],
  )

  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!animated) return

    let raf: number

    const tick = () => {
      setTime((t) => t + 0.0075)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [animated])

  const [coords, setCoords] = useState<Coords>({ x: 0, y: 0 })

  const onMouseMove = ((e: MouseEvent<SVGSVGElement>) => {
    if (!hover) return

    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    const { top, left, width, height } = rect

    const xPixelValue = e.clientX - left
    const yPixelValue = e.clientY - top

    const x = (xPixelValue / width) * viewBoxWidth
    const y = (yPixelValue / height) * viewBoxHeight

    setCoords({ x, y })
  }) as MouseEventHandler<SVGSVGElement>

  const nodes: Node[] = initialNodes.map(({ x, y, seed }, i) => {
    const mouseX = coords.x
    const mouseY = coords.y

    const cos = Math.cos(time + seed)
    const sin = Math.sin(time + seed)

    // Drift
    const driftRadius = 15
    const driftX = cos * driftRadius
    const driftY = sin * driftRadius

    //////
    let opacity = 1
    let size = 2

    if (cos >= 0.6) {
      const diff = cos - 0.7
      const perc = diff / 0.3
      opacity = 1 - perc
    }

    if (sin > 0) {
      size = sin + 2
    }
    //////

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

      return {
        x: finalX,
        y: finalY,
        seed,
        stemStyle: { opacity },
        size,
      } satisfies Node
    }

    return {
      x: finalX,
      y: finalY,
      seed,
      stemStyle: { opacity },
      size,
    } satisfies Node
  })

  const _stemGradient = stemGradient.length
    ? stemGradient
    : fallbackStemGradient

  return (
    <svg
      className="svg"
      onPointerMove={onMouseMove}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      {...rest}
    >
      <defs>
        <radialGradient
          className=""
          id="stem-gradient"
          gradientUnits="userSpaceOnUse"
          // x1={0}
          // y1={'50%'}
          // x2={0}
          // y2={'100%'}

          cx={WIDTH / 2}
          cy={HEIGHT / 2}
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
      {backgroundGradient.length && (
        <rect
          x={0}
          y={0}
          height={HEIGHT}
          width={WIDTH}
          fill="url(#background-gradient)"
          style={{ opacity: 0.75 }}
        />
      )}
      {nodes.map(({ x, y, stemStyle = {}, nodeStyle = {}, size }, key) => (
        <g key={key}>
          <circle
            cx={x}
            cy={y}
            r={size}
            style={{
              fill: 'url(#stem-gradient)',
              opacity: stemStyle.opacity,
              ...nodeStyle,
            }}
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
              ...stemStyle,
            }}
          ></line>
        </g>
      ))}
    </svg>
  )
}
