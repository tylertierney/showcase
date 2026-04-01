import {
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type PropsWithChildren,
} from 'react'
import styles from './matrix.module.scss'

const shuffleWord = (str: string) => {
  const arr = str.split('')

  let i = 0
  while (i < str.length) {
    const randIndex = ~~(Math.random() * str.length)
    ;[arr[i], arr[randIndex]] = [arr[randIndex], arr[i]]
    i++
  }

  return arr.join('')
}

const addSpaces = (str: string) => {
  let i = 0
  while (i < str.length) {
    const addSpace = Math.random() < 0.25

    if (addSpace) {
      str = str.slice(0, i) + ' ' + str.slice(i)
      i++
    }
    i++
  }
  return str
}

const randomizeCaps = (str: string) => {
  let i = 0
  while (i < str.length) {
    if (Math.random() < 0.25) {
      str = str.slice(0, i) + str[i].toUpperCase() + str.slice(i + 1)
    } else {
      str = str.slice(0, i) + str[i].toLowerCase() + str.slice(i + 1)
    }
    i++
  }

  return str
}

const defaultColors: Array<CSSProperties['color']> = [
  'cyan',
  'yellow',
  'lightgreen',
  'gray',
  '#ff8153', // orange
  '#d166d1', // pink
]

const randomColor = defaultColors[~~(Math.random() * defaultColors.length)]

type Props = HTMLAttributes<HTMLDivElement> & {
  word: string
  color?: CSSProperties['color']
  wordFormatter?: (str: string) => string
  columnCount?: number
}

export const MatrixText = ({
  word,
  color = randomColor,
  wordFormatter,
  columnCount = 200,
  children,
  style = {},
  ...rest
}: PropsWithChildren<Props>) => {
  const arrWithRandomProperties = useMemo(() => {
    const arr = wordFormatter
      ? Array(columnCount)
          .fill(null)
          .map(() => wordFormatter(word))
      : Array(columnCount)
          .fill(null)
          .map(() => randomizeCaps(`${shuffleWord(word)}${shuffleWord(word)}`))
          .map((str) => addSpaces(str))

    return arr.map((str) => ({
      str,
      // eslint-disable-next-line react-hooks/purity
      top: ~~(Math.random() * 100) - 100 + '%',
      // eslint-disable-next-line react-hooks/purity
      animationDuration: ~~(Math.random() * 10) + 40 + 's',
    }))
  }, [word, wordFormatter, columnCount])

  return (
    <div style={{ display: 'flex', position: 'relative', ...style }} {...rest}>
      {arrWithRandomProperties.map(({ str, top, animationDuration }, idx) => (
        <div key={idx} className={styles.matrixTextContainer}>
          <span
            style={{
              top,
              animationDuration,
              backgroundImage: `linear-gradient(to bottom, transparent, color-mix(in hsl, ${color} 50%, transparent), ${color})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              display: 'flex',
              flexDirection: 'column',
            }}
            className={styles.gradientText}
          >
            {str.split('').map((char, idx) => (
              <span key={idx}>{char}</span>
            ))}
          </span>
        </div>
      ))}
      {children}
    </div>
  )
}
