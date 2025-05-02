import { Ref, useImperativeHandle, useRef, useState } from "react"
import { HexColor, Tools, UndoRedoState } from "./types"
import CanvasCore, { CanvasRefHandle } from "./CanvasCore"
import { FaPaintBrush, FaEraser, FaUndo, FaRedo, FaTrash } from "react-icons/fa"

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
      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap bg-white shadow rounded border border-neutral-300 p-2">
        <button disabled={tool === "pen"} onClick={() => setTool("pen")}>
          <FaPaintBrush />
        </button>
        <button disabled={tool === "eraser"} onClick={() => setTool("eraser")}>
          <FaEraser />
        </button>
        <input type="range" min="1" max="70" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} />
        <input type="color" value={color} onChange={e => setColor(e.target.value as HexColor)} />
        <button onClick={handleUndo} disabled={!canUndoRedo["undo"]}>
          <FaUndo />
        </button>
        <button onClick={handleRedo} disabled={!canUndoRedo["redo"]}>
          <FaRedo />
        </button>
        <button onClick={handleReset}>
          <FaTrash />
        </button>
      </div>
    </div>
  )
}
