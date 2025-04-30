import { RefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"

type CanvasCoreProps = {
  ref: RefObject<unknown>
}

export default function CanvasCore({ ref }: CanvasCoreProps) {
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

  useImperativeHandle(ref, () => {
    return {
      reset() {
        const canvas = canvasRef.current
        const ctx = contextRef.current
        if (!canvas || !ctx) return

        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      },
    }
  })

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const dpr = window.devicePixelRatio || 1
    const width = parent.clientWidth
    const aspectRatio = 3 / 2
    const height = width / aspectRatio

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
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
  }, [canvasRef])

  useEffect(() => {
    resizeCanvas()
    didMount.current = true
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [resizeCanvas])

  function saveState() {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!context || !canvas) return

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    undoStack.current.push(imageData)
    redoStack.current = []

    setCanUndoRedo({ redo: redoStack.current.length > 0, undo: undoStack.current.length > 0 })
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
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

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
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

  function handlePointerLeave() {
    const controller = new AbortController()
    abortControllerRef.current = controller

    document.addEventListener("pointerup", stopDrawing, { signal: controller.signal })
  }
  function handlePointerEnter() {
    abortControllerRef.current?.abort()
  }

  return (
    <canvas
      ref={canvasRef}
      className="cursor-crosshair rounded shadow border border-neutral-300 w-full h-auto touch-none"
      onPointerDown={startDrawing}
      onPointerUp={stopDrawing}
      onPointerMove={draw}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
    />
  )
}
