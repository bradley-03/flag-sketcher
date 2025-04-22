import { useEffect, useRef, useState } from "react"

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const didMount = useRef<boolean>(false)
  const undoStack = useRef<ImageData[]>([])
  const redoStack = useRef<ImageData[]>([])
  const [canUndoRedo, setCanUndoRedo] = useState({ undo: false, redo: false })
  const abortControllerRef = useRef<AbortController>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lineWidth, setLineWidth] = useState(3)
  const [color, setColor] = useState("#000000")
  const [currentTool, setCurrentTool] = useState("pen")

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const dpr = window.devicePixelRatio || 1
    const width = parent.clientWidth
    const aspectRatio = 3 / 2
    const height = width / aspectRatio

    const ctx = canvas.getContext("2d")
    const image = ctx?.getImageData(0, 0, canvas.width, canvas.height)

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const scaledCtx = canvas.getContext("2d")
    if (scaledCtx) {
      scaledCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      contextRef.current = scaledCtx
      contextRef.current.fillStyle = "white"
      contextRef.current.fillRect(0, 0, canvas.width, canvas.height)
    }

    if (image && didMount.current) {
      scaledCtx?.putImageData(image, 0, 0)
    }
  }

  useEffect(() => {
    resizeCanvas()
    didMount.current = true
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  function saveState() {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!context || !canvas) return

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    undoStack.current.push(imageData)
    redoStack.current = []

    setCanUndoRedo({ redo: redoStack.current.length > 0, undo: undoStack.current.length > 0 })
  }

  function startDrawing(event: React.MouseEvent<HTMLCanvasElement>) {
    const ctx = contextRef.current
    if (!ctx) return

    setIsDrawing(true)
    saveState()
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = currentTool === "pen" ? color : "white"
    ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    ctx.stroke()
  }

  function stopDrawing() {
    setIsDrawing(false)
    contextRef.current?.closePath()
  }

  function draw(event: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing || !contextRef.current) return
    contextRef.current.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    contextRef.current.stroke()
  }

  function undo() {
    const context = contextRef.current
    const canvas = canvasRef.current
    if (!context || !canvas || undoStack.current.length === 0) return

    const currentState = context.getImageData(0, 0, canvas.width, canvas.height)
    redoStack.current.push(currentState)

    const previous = undoStack.current.pop()
    if (previous) context.putImageData(previous, 0, 0)

    setCanUndoRedo({ redo: redoStack.current.length > 0, undo: undoStack.current.length > 0 })
  }

  function redo() {
    const context = contextRef.current
    const canvas = canvasRef.current
    if (!context || !canvas || redoStack.current.length === 0) return

    const currentState = context.getImageData(0, 0, canvas.width, canvas.height)
    undoStack.current.push(currentState)

    const previous = redoStack.current.pop()
    if (previous) context.putImageData(previous, 0, 0)

    setCanUndoRedo({ redo: redoStack.current.length > 0, undo: undoStack.current.length > 0 })
  }

  function setPenTool() {
    // contextRef.current!.globalCompositeOperation = "source-over"
    setCurrentTool("pen")
  }

  function setEraserTool() {
    // contextRef.current!.globalCompositeOperation = "destination-out"
    setCurrentTool("eraser")
  }

  function handleMouseLeave() {
    const controller = new AbortController()
    abortControllerRef.current = controller

    document.addEventListener("mouseup", stopDrawing, { signal: controller.signal })
  }
  function handleMouseEnter() {
    abortControllerRef.current?.abort()
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <canvas
        ref={canvasRef}
        className=" cursor-crosshair rounded shadow border border-neutral-300 w-full h-auto"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onMouseMove={draw}
      />
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <button disabled={currentTool === "pen"} onClick={setPenTool}>
          Pen
        </button>
        <button disabled={currentTool === "eraser"} onClick={setEraserTool}>
          Eraser
        </button>
        <input type="range" min="1" max="70" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} />
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        <button disabled={!canUndoRedo["undo"]} onClick={undo}>
          Undo
        </button>
        <button disabled={!canUndoRedo["redo"]} onClick={redo}>
          Redo
        </button>
      </div>
    </div>
  )
}
