import { Ref, useImperativeHandle, useRef, useState } from "react"
import { HexColor, Tools, UndoRedoState } from "./types"
import CanvasCore, { CanvasRefHandle } from "./CanvasCore"

type DrawingCanvasProps = {
  ref: Ref<CanvasRefHandle>
}

export default function DrawingCanvas({ ref }: DrawingCanvasProps) {
  const canvasRef = useRef<CanvasRefHandle>(null)
  const [canUndoRedo, setCanUndoRedo] = useState<UndoRedoState>({ undo: false, redo: false })
  const [color, setColor] = useState<HexColor>("#000000")
  const [lineWidth, setLineWidth] = useState<number>(3)
  const [tool, setTool] = useState<Tools>("pen")

  function handleReset() {
    canvasRef.current?.reset()
  }
  function handleUndo() {
    canvasRef.current?.undo()
  }
  function handleRedo() {
    canvasRef.current?.redo()
  }

  // expose methods again for higher usage
  useImperativeHandle(ref, () => {
    return {
      reset: handleReset,
      undo: handleUndo,
      redo: handleRedo,
    }
  })

  function handleUndoRedoChange(newState: { redo: boolean; undo: boolean }) {
    setCanUndoRedo(newState)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <CanvasCore
        ref={canvasRef}
        onUndoRedoChange={handleUndoRedoChange}
        color={color}
        tool={tool}
        lineWidth={lineWidth}
      />
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <button disabled={tool === "pen"} onClick={() => setTool("pen")}>
          Pen
        </button>
        <button disabled={tool === "eraser"} onClick={() => setTool("eraser")}>
          Eraser
        </button>
        <input type="range" min="1" max="70" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} />
        <input type="color" value={color} onChange={e => setColor(e.target.value as HexColor)} />
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
