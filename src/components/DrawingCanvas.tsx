import { useRef, useState } from "react"
import CanvasCore from "./CanvasCore"

export default function DrawingCanvas() {
  const canvasRef = useRef<unknown>(null)
  const [canUndoRedo, setCanUndoRedo] = useState({ undo: false, redo: false })

  function handleReset() {
    canvasRef.current?.reset()
  }
  function handleUndo() {
    canvasRef.current?.undo()
  }
  function handleRedo() {
    canvasRef.current?.redo()
  }

  function handleUndoRedoChange(newState) {
    setCanUndoRedo(newState)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <CanvasCore ref={canvasRef} onUndoRedoChange={handleUndoRedoChange} />
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {/* <button disabled={currentTool === "pen"} onClick={setPenTool}>
          Pen
        </button>
        <button disabled={currentTool === "eraser"} onClick={setEraserTool}>
          Eraser
        </button>
        <input type="range" min="1" max="70" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} />
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
         */}
        <button onClick={handleUndo} disabled={!canUndoRedo["undo"]}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={!canUndoRedo["redo"]}>
          Redo
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  )
}
