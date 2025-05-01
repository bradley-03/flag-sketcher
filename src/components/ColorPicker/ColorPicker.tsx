import { ColorResult, SketchPicker } from "react-color"
import { HexColor } from "../DrawingCanvas/types"
import { useState, useEffect, useRef } from "react"

type ColorPickerProps = {
  onChange: (color: HexColor) => void
  color: HexColor
}

export default function ColorPicker({ onChange, color }: ColorPickerProps) {
  const [pickerOpen, setPickerOpen] = useState<boolean>(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  function handleColorChange(color: ColorResult) {
    onChange(color.hex as HexColor)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        buttonRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setPickerOpen(false)
      }
    }

    if (pickerOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [pickerOpen])

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="w-8 h-8 rounded border border-gray-300 shadow-sm"
        style={{ backgroundColor: color }}
        onClick={() => setPickerOpen(prev => !prev)}
      />
      {pickerOpen && (
        <div
          className="absolute bottom-10 z-50 shadow-lg rounded overflow-hidden touch-none text-black"
          ref={pickerRef}
        >
          <SketchPicker
            disableAlpha={true}
            onChange={handleColorChange}
            color={color}
            presetColors={["#D0021B", "#131FE6", "#FFD92B", "#008F4C", "#FFFFFF", "#000000"]}
          />
        </div>
      )}
    </div>
  )
}
