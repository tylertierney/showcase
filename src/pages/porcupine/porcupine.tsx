import { useState } from 'react'
import Porcupine from '../../components/porcupine/porcupine'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '../../components/ui/field'
import { Switch } from '../../components/ui/switch'

type GradientKey = 'sunrise' | 'none'

type GradientMap = Record<GradientKey, string[]>

const bgGradientMap: GradientMap = {
  none: [],
  sunrise: ['#ab96ff', '#ff96c4', '#ffc74f', '#ffe4aa', '#ffefcb'],
}

const stemGradientMap: GradientMap = {
  none: [],
  sunrise: ['#513aad69', '#513aad', '#d04ee4', '#ff667d'],
}

const gradients: GradientKey[] = ['none', 'sunrise']

export const PorcupinePage = () => {
  const [onlyShowHalf, setOnlyShowHalf] = useState(false)
  const [bgGradient, setBgGradient] = useState<GradientKey>('none')
  const [stemGradient, setStemGradient] = useState<GradientKey>('sunrise')
  const [animated, setAnimated] = useState(true)
  const [hover, setHover] = useState(true)

  const viewBoxHeight = onlyShowHalf ? 300 : undefined

  return (
    <div className="min-h-screen flex flex-col pt-12 px-8 items-center">
      <div className="flex flex-wrap gap-6 mb-12 justify-center">
        <FieldSet className="max-w-sm">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="only-show-half-size">
                Only show half
              </FieldLabel>
              <FieldDescription>
                Use a semicircle instead of the full component
              </FieldDescription>
            </FieldContent>
            <Switch
              id="only-show-half-size"
              checked={onlyShowHalf}
              onCheckedChange={(val) => setOnlyShowHalf(val)}
            />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="animated">Animated</FieldLabel>
              <FieldDescription>Allow floaty animations</FieldDescription>
            </FieldContent>
            <Switch
              id="animated"
              checked={animated}
              onCheckedChange={(val) => setAnimated(val)}
            />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="hover">Hover</FieldLabel>
              <FieldDescription>Allow mouseover event</FieldDescription>
            </FieldContent>
            <Switch
              id="hover"
              checked={hover}
              onCheckedChange={(val) => setHover(val)}
            />
          </Field>
        </FieldSet>
        <FieldSet>
          <FieldTitle>Background Gradient</FieldTitle>
          <FieldDescription>
            Supply an array of colors to use as the background gradient.
          </FieldDescription>
          <RadioGroup
            value={bgGradient}
            onValueChange={(val) => setBgGradient(val as GradientKey)}
          >
            {gradients.map((value, idx) => (
              <FieldLabel htmlFor={`bg-${value}`} key={idx}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>
                      {`${value[0].toUpperCase()}${value.substring(1)}`}
                    </FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value={value} id={`bg-${value}`} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>

        <FieldSet>
          <FieldTitle>Stem Gradient</FieldTitle>
          <FieldDescription>
            Supply an array of colors to use as the stem gradient.
          </FieldDescription>
          <RadioGroup
            value={stemGradient}
            onValueChange={(val) => setStemGradient(val as GradientKey)}
          >
            {gradients.map((value, idx) => (
              <FieldLabel htmlFor={`stem-${value}`} key={idx}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>
                      {`${value[0].toUpperCase()}${value.substring(1)}`}
                    </FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value={value} id={`stem-${value}`} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
      </div>
      <Porcupine
        numberOfNodes={500}
        className="w-300 max-w-full mb-86"
        backgroundGradient={bgGradientMap[bgGradient]}
        stemGradient={stemGradientMap[stemGradient]}
        viewBoxHeight={viewBoxHeight}
        animated={animated}
        hover={hover}
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}
