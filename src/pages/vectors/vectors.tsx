import { useEffect, useState, type CSSProperties } from 'react'
import { Button } from '../../components/ui/button'

function checkCollision(a: Circle, b: Circle) {
  const dx = a.cx - b.cx
  const dy = a.cy - b.cy
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < a.r + b.r
}

type Circle = {
  cx: number
  cy: number
  r: number
  vector: {
    x: number
    y: number
  }
  style?: CSSProperties
}

const WIDTH = 500
const HEIGHT = 500

const generateCircles = (): Circle[] => {
  return Array(4)
    .fill(null)
    .map(() => {
      const radius = ~~(Math.random() * 20) + 20
      return {
        cx: ~~(Math.random() * (WIDTH - radius * 2)) + radius,
        cy: ~~(Math.random() * (HEIGHT - radius * 2)) + radius,
        r: radius,
        vector: {
          x: Math.random() * 3 - 1.5,
          y: Math.random() * 3 - 1.5,
        },
      }
    })
}

export const Vectors = () => {
  const [circles, setCircles] = useState<Circle[]>(generateCircles())

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCircles((prev) =>
      prev.map((circle, idx): Circle => {
        const { cx, cy, vector, r } = circle
        const { x, y } = vector

        const newCx = cx + x
        const newCy = cy + y

        const res: Circle = {
          ...circle,
          cx: newCx,
          cy: newCy,
          vector: {
            x: newCx + r >= WIDTH || newCx - r <= 0 ? -x : x,
            y: newCy + r >= HEIGHT || newCy - r <= 0 ? -y : y,
          },
        }

        let isColliding = false

        for (let i = 0; i < prev.length; i++) {
          if (i === idx) {
            continue
          }

          if (checkCollision(res, prev[i])) {
            isColliding = true
            break
          }
        }

        return { ...res, style: { fill: isColliding ? 'green' : 'red' } }
      }),
    )
  }, [time])

  return (
    <div className="flex flex-col min-h-screen justify-center items-center gap-12">
      <Button
        className="px-6 py-4"
        onClick={() => {
          const newCircles = generateCircles()
          console.log(newCircles)
          setCircles(newCircles)
        }}
      >
        Reset
      </Button>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="500"
        style={{ border: 'solid lightblue 1px' }}
      >
        {circles.map(({ cx, cy, r, style = {} }, key) => (
          <circle key={key} cx={cx} cy={cy} r={r} fill="red" style={style} />
        ))}
      </svg>
    </div>
  )
}
