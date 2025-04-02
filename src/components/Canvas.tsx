import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas"
import { ChangeEvent, useRef, useState } from "react"

export default function Canvas() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null)
  const [eraseMode, setEraseMode] = useState<boolean>(false)
  const [strokeColor, setStrokeColor] = useState<string>("black")

  const handleEraserClick = () => {
    setEraseMode(true)
    canvasRef.current?.eraseMode(true)
  }

  const handlePenClick = () => {
    setEraseMode(false)
    canvasRef.current?.eraseMode(false)
  }

  function updateStrokeColor(event: ChangeEvent<HTMLInputElement>) {
    setStrokeColor(event.target.value)
  }

  return (
    <div>
      <button onClick={handlePenClick} disabled={!eraseMode}>
        Pen
      </button>
      <button onClick={handleEraserClick} disabled={eraseMode}>
        Eraser
      </button>
      <input type="color" onChange={updateStrokeColor} />
      <ReactSketchCanvas
        ref={canvasRef}
        strokeColor={strokeColor}
        canvasColor="white"
        eraserWidth={30}
        height="250px"
        width="25%"
      />
    </div>
  )
}
