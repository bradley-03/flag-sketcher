import { useLayoutEffect, useRef, useState } from "react"

export default function CustomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [lineWidth, setLineWidth] = useState<number>(3)
  const [color, setColor] = useState<string>("#000000")
  const [currentTool, setCurrentTool] = useState<string>("pen")

  function startDrawing(event: React.MouseEvent<HTMLCanvasElement>) {
    if (contextRef.current) {
      setIsDrawing(true)
      contextRef.current.beginPath()
      contextRef.current.lineWidth = lineWidth
      contextRef.current.lineCap = "round"
      contextRef.current.lineJoin = "round"
      contextRef.current.strokeStyle = color
      contextRef.current.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
      contextRef.current.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
      contextRef.current.stroke()
    }
  }

  function stopDrawing() {
    setIsDrawing(false)
    contextRef.current?.closePath()
  }

  function draw(event: React.MouseEvent<HTMLCanvasElement>) {
    if (!contextRef.current || !isDrawing) return
    contextRef.current.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    contextRef.current?.stroke()
  }

  function setPenTool() {
    contextRef.current!.globalCompositeOperation = "source-over"
    setCurrentTool("pen")
  }

  function setEraserTool() {
    contextRef.current!.globalCompositeOperation = "destination-out"
    setCurrentTool("eraser")
  }

  useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      contextRef.current = ctx
    }
  })

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="bg-white"
        onMouseDown={e => {
          startDrawing(e)
        }}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onMouseMove={e => {
          draw(e)
        }}
        height={500}
        width={500}
      ></canvas>
      <button disabled={currentTool === "pen"} onClick={setPenTool}>
        Pen
      </button>
      <button disabled={currentTool === "eraser"} onClick={setEraserTool}>
        Eraser
      </button>
      <input type="range" min="1" max="40" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} />
      <input type="color" onChange={e => setColor(e.target.value)} />
    </div>
  )
}
