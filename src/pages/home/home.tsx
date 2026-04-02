import { Link, type LinkProps } from 'react-router-dom'
import bridge from '../../bridge.svg'
import { buttonVariants } from '@/components/ui/button'
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import Porcupine from '../../components/porcupine/porcupine'
import { MatrixText } from '../../components/matrix/matrix'
import { FieldSeparator } from '../../components/ui/field'

const HomeSection = ({
  title,
  headline,
  description,
  link,
  children,
  className = '',
  ...rest
}: PropsWithChildren<
  {
    title: string
    headline: string
    description: string[]
    link: LinkProps['to']
  } & ComponentProps<'div'>
>) => {
  return (
    <div
      className={`flex flex-col items-stretch justify-between self-stretch lg:flex-row lg:gap-10 lg:items-center ${className}`}
      {...rest}
    >
      <div className="flex flex-col gap-8 self-center lg:min-w-124">
        <h3
          style={{ letterSpacing: 1.5 }}
          className="font-medium opacity-75 font-mono"
        >
          {title.toUpperCase()}
        </h3>
        <h1 className="text-5xl font-medium">{headline}</h1>
        {description.map((p, key) => (
          <p
            key={key}
            style={{ fontSize: '1.2rem', lineHeight: 1.4, maxWidth: '38ch' }}
          >
            {p}
          </p>
        ))}
        <Link
          to={link}
          className={`${buttonVariants({ variant: 'default', size: 'lg' })} self-end py-6 px-8 text-lg`}
        >
          See How →
        </Link>
      </div>
      {children}
    </div>
  )
}

export const Home = () => {
  return (
    <div className="container max-w-6xl flex flex-col gap-10 min-h-screen mb-64 py-16">
      <HomeSection
        title="PARABOLA"
        headline="Building Bridges"
        description={[
          `
          A highly composable SVG-based parabola component that lets you render arbitrary React nodes along a calculated curve.
          Ideal for the designer who needs flexibility and extensibility when generating their UX elements.`,
        ]}
        link="/parabola"
      >
        <img className="w-full" src={bridge} />
      </HomeSection>
      <FieldSeparator />
      <HomeSection
        title="PORCUPINE"
        headline="Motion & Interaction"
        description={[
          `Poke it. I got this design idea from Stripe.com. The "porcupine" adds a whimsical flair. At least on devices with a mouse...`,
        ]}
        link="/porcupine"
        className="lg:flex-row-reverse"
      >
        <Porcupine className="min-h-74" style={{ touchAction: 'none' }} />
      </HomeSection>
      <FieldSeparator />
      <HomeSection
        title="MATRIX"
        headline="Digitalize"
        description={[
          `"Never send a human to do a machine's job."`,
          `Tweak some variables and take control of this Matrix-esque text effect.`,
        ]}
        link="/matrix"
      >
        <MatrixText
          word="Digitalize"
          color="var(--foreground)"
          className="overflow-hidden h-160"
        />
      </HomeSection>
      <HomeSection
        title="FLOW"
        headline="Boxes of stuff"
        description={[
          `Playing around with objects inside of an SVG and connecting them via lines like in a flowchart.`,
        ]}
        link="/boxes"
      ></HomeSection>
    </div>
  )
}
