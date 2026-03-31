import { useState } from 'react'
import Porcupine from '../../components/porcupine/porcupine'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import {
  Field,
  FieldContent,
  FieldDescription,
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

  const viewBoxHeight = onlyShowHalf ? 300 : undefined

  return (
    <div className="min-h-screen flex flex-col pt-12 px-8 items-center">
      <div className="flex flex-wrap gap-6 mb-12">
        <Field
          orientation="horizontal"
          className="max-w-sm border-2 p-6 rounded-md shadow-sm"
        >
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
        <FieldSet className="max-w-sm border-2 p-6 rounded-md shadow-sm">
          <FieldTitle>Background Gradient</FieldTitle>
          <FieldDescription>
            Supply an array of colors to use as the background gradient.
          </FieldDescription>
          <RadioGroup value={bgGradient}>
            {gradients.map((value, idx) => (
              <FieldLabel htmlFor={`bg-${value}`} key={idx}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>
                      {`${value[0].toUpperCase()}${value.substring(1)}`}
                    </FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    value={value}
                    id={`bg-${value}`}
                    onClick={() => setBgGradient(value)}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>

        <FieldSet className="max-w-sm border-2 p-6 rounded-md shadow-sm">
          <FieldTitle>Background Gradient</FieldTitle>
          <FieldDescription>
            Supply an array of colors to use as the stem gradient.
          </FieldDescription>
          <RadioGroup value={stemGradient}>
            {gradients.map((value, idx) => (
              <FieldLabel htmlFor={`stem-${value}`} key={idx}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>
                      {`${value[0].toUpperCase()}${value.substring(1)}`}
                    </FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    onChange={console.log}
                    value={value}
                    id={`stem-${value}`}
                    onClick={() => setStemGradient(value)}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
      </div>
      <Porcupine
        numberOfNodes={500}
        className="w-200 max-w-full"
        backgroundGradient={bgGradientMap[bgGradient]}
        stemGradient={stemGradientMap[stemGradient]}
        viewBoxHeight={viewBoxHeight}
      />
      {/* <Porcupine
        style={{ width: '600px', maxWidth: '100vw' }}
        numberOfNodes={100}
        viewBoxWidth={600}
        viewBoxHeight={300}
        backgroundGradient={[]}
      /> */}
    </div>
  )
}
