import { useRef, useState, type RefObject } from 'react'
import Parabola, {
  type ParabolaArgs,
  type ParabolaProps,
} from '../../components/parabola/parabola'
import { Button } from '../../components/ui/button'
import { toast } from 'sonner'

const defaultArgs: ParabolaArgs = {
  minX: -100,
  maxX: 110,
  step: 1.5,
  a: 0.015,
  h: 0,
  k: -50,
}

type Control = {
  label: string
  key: keyof ParabolaArgs
  min: number
  max: number
  step: number
}

export const ParabolaPage = () => {
  const [args, setArgs] = useState<ParabolaArgs>(defaultArgs)
  const ref = useRef<SVGSVGElement>(null)

  const controls: Control[] = [
    {
      label: 'Min X',
      key: 'minX',
      min: -100,
      max: 100,
      step: 1,
    },
    {
      label: 'Max X',
      key: 'maxX',
      min: -150,
      max: 150,
      step: 1,
    },
    {
      label: 'Step',
      key: 'step',
      min: 0.01,
      max: 50,
      step: 0.01,
    },
    {
      label: 'a',
      key: 'a',
      min: -1,
      max: 1,
      step: 0.0001,
    },
    {
      label: 'h',
      key: 'h',
      min: -100,
      max: 100,
      step: 1,
    },
    {
      label: 'k',
      key: 'k',
      min: -100,
      max: 100,
      step: 1,
    },
  ]

  const pointEl: ParabolaProps['pointEl'] = ({ x, y }, key) => {
    const id = `gradient${key}`
    const x1 = x - 30
    const x2 = x + 30
    const y1 = y - 30
    const y2 = x / 2 + 20

    return (
      <>
        <defs>
          <linearGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            x1={x1}
            x2={x2}
            y1={y1}
            y2={y2}
          >
            <stop offset="0%" stop-color="gray" />
            <stop offset="50%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <line
          key={key}
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
          strokeLinecap="round"
          stroke={`url(#${id})`}
          style={{
            strokeWidth: '1',
          }}
        />
      </>
    )
  }

  // useEffect(() => {
  //   const cb = () => {
  //     setArgs((prev) => ({
  //       ...prev,
  //       h: prev.h + 0.0001,
  //       a: prev.a - 0.000001,
  //     }))
  //   }
  //   const interval = setInterval(cb, 10)

  //   return () => clearInterval(interval)
  // }, [])

  const copy = (ref: RefObject<SVGSVGElement | null>) => {
    if (!ref) return
    if (!ref.current) return
    const curr = ref.current
    if (!curr) return

    const html = curr.outerHTML

    navigator.clipboard.writeText(html)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-14 mb-28">
      <Parabola args={args} ref={ref} pointEl={pointEl} />
      <Button variant="outline" onClick={() => setArgs(defaultArgs)}>
        Reset to default
      </Button>
      <div className="flex flex-col gap-2">
        {controls.map(({ label, key, min, max, step }, idx) => (
          <label key={idx} className="flex flex-col gap-1">
            {label}
            <input
              type="range"
              value={args[key]}
              min={min}
              max={max}
              step={step}
              onChange={(e) => {
                const res = Number(e.target.value)
                setArgs((prev) => ({
                  ...prev,
                  [key]: res,
                }))
              }}
            />
            <input
              className="self-end"
              type="number"
              style={{ width: '100px' }}
              value={args[key]}
              max={max}
              min={min}
              step={step}
              onChange={(e) => {
                const res = Number(e.target.value)
                setArgs((prev) => ({
                  ...prev,
                  [key]: res,
                }))
              }}
            />
          </label>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={() => {
          try {
            copy(ref)
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
