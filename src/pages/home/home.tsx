import { Link, type LinkProps } from 'react-router-dom'
import bridge from '../../bridge.svg'
import { buttonVariants } from '@/components/ui/button'
import type { PropsWithChildren } from 'react'
import Porcupine from '../../components/porcupine/porcupine'

const HomeSection = ({
  title,
  headline,
  description,
  link,
  children,
}: PropsWithChildren<{
  title: string
  headline: string
  description: string
  link: LinkProps['to']
}>) => {
  return (
    <div className="flex flex-col items-center justify-between lg:flex-row lg:gap-8">
      <div className="flex flex-col p-8 gap-8 lg:min-w-124">
        <h3
          style={{ letterSpacing: 1.5 }}
          className="font-medium opacity-75 font-mono"
        >
          {title.toUpperCase()}
        </h3>
        <h1 className="text-5xl font-medium">{headline}</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.4, maxWidth: '38ch' }}>
          {description}
        </p>
        <Link
          to={link}
          className={`${buttonVariants({ variant: 'default', size: 'lg' })} self-end py-6 px-8 text-lg`}
        >
          See How →
        </Link>
      </div>
      {children}

      {/* <div className="flex flex-col items-center justify-center">hi</div> */}
    </div>
  )
}

export const Home = () => {
  return (
    <div className="max-w-6xl flex flex-col min-h-screen mb-64">
      <HomeSection
        title="PARABOLA"
        headline="Building Bridges"
        description={`
          A highly composable SVG-based parabola component that lets you render arbitrary React nodes along a calculated curve.
          Ideal for the designer who needs flexibility and extensibility when generating their UX elements.`}
        link="/parabola"
      >
        <img className="w-full" src={bridge} style={{ maxWidth: '870px' }} />
      </HomeSection>
      <HomeSection
        title="PORCUPINE"
        headline="Motion & Interaction"
        description={`Poke it. Prod it. Love it.`}
        link="/porcupine"
      >
        <Porcupine style={{ minHeight: '300px' }} />
      </HomeSection>
    </div>
  )
}
