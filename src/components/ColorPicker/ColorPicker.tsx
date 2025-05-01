import { ColorResult, ChromePicker } from "react-color"
import { HexColor } from "../DrawingCanvas/types"
import { useState } from "react"

type ColorPickerProps = {
  onChange: (color: HexColor) => void
  color: HexColor
}

export default function ColorPicker({ onChange, color }: ColorPickerProps) {
  const [pickerOpen, setPickerOpen] = useState<boolean>(false)

  function handleColorChange(color: ColorResult) {
    onChange(color.hex as HexColor)
  }

  return (
    <div>
      <div>
        <button
          style={{ backgroundColor: color }}
          className="border-4 border-green-500"
          onClick={() => setPickerOpen(old => !old)}
        ></button>
      </div>
      {pickerOpen && (
        <div className="absolute z-10 inline-block text-black transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs dark:bg-gray-700">
          <ChromePicker disableAlpha={true} onChange={handleColorChange} color={color} />
        </div>
      )}
    </div>
  )
}
