import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas"
import { ChangeEvent, useRef, useState } from "react"

export default function Canvas() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null)
  const [eraseMode, setEraseMode] = useState<boolean>(false)
  const [strokeColor, setStrokeColor] = useState<string>("black")
  const [strokeWidth, setStrokeWidth] = useState<number>(3)

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

  function handleUndoClick() {
    canvasRef.current?.undo()
  }

  function handleRedoClick() {
    canvasRef.current?.redo()
  }

  function handleClearClick() {
    canvasRef.current?.resetCanvas()
  }

  function handleStrokeWidthChange(event: ChangeEvent<HTMLInputElement>) {
    setStrokeWidth(+event.target.value)
  }

  return (
    <div>
      <input type="color" onChange={updateStrokeColor} />
      <button onClick={handlePenClick} disabled={!eraseMode}>
        Pen
      </button>
      <button onClick={handleEraserClick} disabled={eraseMode}>
        Eraser
      </button>
      <input type="range" onChange={handleStrokeWidthChange} value={strokeWidth} min={1} max={100} />
      <button onClick={handleUndoClick}>Undo</button>
      <button onClick={handleRedoClick}>Redo</button>
      <button onClick={handleClearClick}>Clear</button>

      <ReactSketchCanvas
        ref={canvasRef}
        strokeColor={strokeColor}
        canvasColor="white"
        strokeWidth={strokeWidth}
        eraserWidth={30}
        height="250px"
        width="25%"
      />
    </div>
  )
}
