import { useState } from 'react'
import { MatrixText } from '../../components/matrix/matrix'
import { ColorPicker } from '../../components/ui/color-picker'
import { FieldSet, FieldTitle } from '../../components/ui/field'

export const MatrixPage = () => {
  const [color, setColor] = useState('var(--color-purple-600)')
  return (
    <div className="relative min-w-screen max-w-screen overflow-hidden h-screen">
      <MatrixText className="w-full h-full" word="Leetcode" color={color}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod
        </p>
      </MatrixText>
      <FieldSet className="min-w-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-md">
        <FieldTitle>Color</FieldTitle>
        <ColorPicker
          className="self-start min-w-12"
          value={color}
          onChange={(val) =>
            setColor(typeof val === 'string' ? val : 'var(--color-purple-600)')
          }
        />
      </FieldSet>
    </div>
  )
}
