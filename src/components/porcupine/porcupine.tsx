import {
  type CSSProperties,
  type MouseEvent,
  type MouseEventHandler,
  type SVGAttributes,
  useEffect,
  useState,
} from 'react'

// const sunriseGradient = [
//   "#003f5b",
//   "#2b4b7d",
//   "#5f5195",
//   "#98509d",
//   "#cc4c91",
//   "#f25375",
//   "#ff6f4e",
//   "#ff8513",
// ];

const sunriseStemGradient = ['#ff667d', '#d04ee4', '#513aad', '#513aad69']
const sunriseGradient = ['#ab96ff', '#ff96c4', '#ffc74f', '#ffe4aa', '#ffefcb']

type Coords = {
  x: number
  y: number
}

const getRandomSemicirclePoints = (
  radius: number,
  centerX: number,
  centerY: number,
): Coords => {
  const theta = Math.PI + Math.random() * Math.PI
  const r = Math.sqrt(Math.random()) * radius
  const x = centerX + r * Math.cos(theta)
  const y = centerY + r * Math.sin(theta)
  return { x, y }
}

type Node = Coords & {
  seed: number
  style?: CSSProperties
}

const WIDTH = 800
const HEIGHT = 500

const initialNodes: Node[] = Array(300)
  .fill(null)
  .map(() => {
    const { x, y } = getRandomSemicirclePoints(HEIGHT / 1.4, WIDTH / 2, HEIGHT)
    return {
      x,
      y,
      seed: Math.random() * 1000,
    }
  })

export default function Porcupine(props: SVGAttributes<SVGSVGElement>) {
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

    const x = (xPixelValue / width) * WIDTH
    const y = (yPixelValue / height) * HEIGHT

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

  return (
    <div className="App">
      <svg
        className="svg sunrise"
        onMouseMove={onMouseMove}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{
          width: WIDTH + 'px',
          height: HEIGHT + 'px',
        }}
        {...props}
      >
        <defs>
          <linearGradient
            className=""
            id="sunrise-gradient"
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={'50%'}
            x2={0}
            y2={'100%'}
          >
            {sunriseStemGradient.map((color, key) => (
              <stop
                key={key}
                offset={(1 / sunriseStemGradient.length) * key}
                style={{ stopColor: color }}
              />
            ))}
          </linearGradient>
          <radialGradient id="sunrise-radial-gradient">
            {sunriseGradient.map((color, key) => (
              <stop
                key={key}
                offset={(1 / sunriseGradient.length) * key}
                style={{ stopColor: color }}
              />
            ))}
            <stop offset={1} style={{ stopColor: 'var(--background)' }} />
          </radialGradient>
        </defs>
        <rect
          x={0}
          y={0}
          height={HEIGHT * 2}
          width={WIDTH}
          fill="url(#sunrise-radial-gradient)"
          style={{ opacity: 0.75 }}
        />
        {nodes.map(({ x, y, style = {} }, key) => (
          <g key={key}>
            <circle
              cx={x}
              cy={y}
              r={1.9}
              style={{ fill: 'url(#sunrise-gradient)', ...style }}
            />
            <line
              key={key}
              x1={x}
              y1={y}
              x2={WIDTH / 2}
              y2={HEIGHT}
              style={{
                stroke: 'url(#sunrise-gradient)',
                opacity: 1,
                strokeLinecap: 'round',
                strokeWidth: 0.5,
              }}
            ></line>
          </g>
        ))}
      </svg>
    </div>
  )
}
