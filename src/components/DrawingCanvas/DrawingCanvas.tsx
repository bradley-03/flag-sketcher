import { Ref, useImperativeHandle, useRef, useState } from "react"
import { HexColor, Tools, UndoRedoState } from "./types"
import CanvasCore, { CanvasRefHandle } from "./CanvasCore"
import { FaPaintBrush, FaEraser, FaUndo, FaRedo, FaTrash } from "react-icons/fa"
import Button from "../Button"
import { Tooltip } from "react-tooltip"

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
      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap bg-white shadow rounded-xl border border-neutral-300 p-2">
        <Tooltip delayShow={400} id="tooltip"></Tooltip>
        <Button
          data-tooltip-id="tooltip"
          data-tooltip-content={"Brush"}
          variant="ghost"
          size="icon"
          disabled={tool === "pen"}
          onClick={() => setTool("pen")}
        >
          <FaPaintBrush />
        </Button>

        <Button
          data-tooltip-id="tooltip"
          data-tooltip-content={"Eraser"}
          variant="ghost"
          size="icon"
          disabled={tool === "eraser"}
          onClick={() => setTool("eraser")}
        >
          <FaEraser />
        </Button>

        <input
          data-tooltip-id="tooltip"
          data-tooltip-content={"Brush Width"}
          type="range"
          min="1"
          max="70"
          value={lineWidth}
          onChange={e => setLineWidth(Number(e.target.value))}
        />

        <input
          data-tooltip-id="tooltip"
          data-tooltip-content={"Brush Color"}
          className="rounded-lg cursor-pointer"
          type="color"
          value={color}
          onChange={e => setColor(e.target.value as HexColor)}
        />
        <Button
          data-tooltip-id="tooltip"
          data-tooltip-content={"Undo"}
          size="icon"
          variant="ghost"
          onClick={handleUndo}
          disabled={!canUndoRedo["undo"]}
        >
          <FaUndo />
        </Button>
        <Button
          data-tooltip-id="tooltip"
          data-tooltip-content={"Redo"}
          size="icon"
          variant="ghost"
          onClick={handleRedo}
          disabled={!canUndoRedo["redo"]}
        >
          <FaRedo />
        </Button>
        <Button
          data-tooltip-id="tooltip"
          data-tooltip-content={"Clear"}
          size="icon"
          variant="ghost"
          onClick={handleReset}
        >
          <FaTrash />
        </Button>
      </div>
    </div>
  )
}
