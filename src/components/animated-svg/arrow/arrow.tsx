import { buttonVariants } from '../../ui/button'
import styles from './arrow.module.scss'
import { useState, type SVGAttributes } from 'react'

export const ArrowIcon = ({
  className,
  ...rest
}: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      className={`${styles.svg} ${className || ''}`}
      viewBox="0 0 10 10"
      {...rest}
    >
      <path className={styles.stem} strokeWidth={0.2} />
      <path className={styles.arrow} />
    </svg>
  )
}

export const Showcase = () => {
  const [extended, setExtended] = useState(false)
  return (
    <span
      onPointerOver={() => setExtended(true)}
      onPointerOut={() => setExtended(false)}
      className={`flex items-center gap-2 cursor-pointer ${buttonVariants({ variant: 'link', size: 'lg' })}`}
    >
      View Now{' '}
      <ArrowIcon width="1rem" className={extended ? styles.extended : ''} />
    </span>
  )
}
