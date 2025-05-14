import countryData from "../data/countryData.json"
import { useState, useRef, useEffect } from "react"
import DrawingCanvas from "./components/DrawingCanvas/DrawingCanvas"
import { CanvasRefHandle } from "./components/DrawingCanvas/CanvasCore"
import Button from "./components/Button"
import { compareImages, getImageAspectRatio } from "./util/compareImages"

type GameHistoryState = {
  country: {
    name: string
    flag: string
  }
  userDrawing: string
  accuracy: number
}[]

function getRandomCountryIndex(): number {
  return Math.floor(Math.random() * countryData.length)
}

function App() {
  const [randomCountryIndex, setRandomCountryIndex] = useState<number>(getRandomCountryIndex())
  const [flagAspect, setFlagAspect] = useState<number>(3 / 2)
  const canvasRef = useRef<CanvasRefHandle>(null)
  const [gameHistory, setGameHistory] = useState<GameHistoryState>([])

  async function rollNewCountry() {
    const newCountryIndex = getRandomCountryIndex()
    setRandomCountryIndex(newCountryIndex)

    canvasRef.current?.reset()
  }

  const country = countryData[randomCountryIndex]

  async function finishDrawing() {
    const imgBase64 = canvasRef.current?.exportImg()
    if (!imgBase64) return
    const { accuracy } = await compareImages(imgBase64, country.flags.png)
    setGameHistory(prev => [
      ...prev,
      {
        country: {
          name: country.name.common,
          flag: country.flags.png,
        },
        userDrawing: imgBase64,
        accuracy,
      },
    ])
    rollNewCountry()
  }

  // Calculate new aspect ratio when the flag changes
  useEffect(() => {
    async function resizeCanvas() {
      const newFlagAspect = await getImageAspectRatio(countryData[randomCountryIndex].flags.png)
      setFlagAspect(newFlagAspect)
    }
    resizeCanvas()
  }, [randomCountryIndex])

  return (
    <div className="flex flex-col w-full justify-center items-center text-center">
      <div className="flex flex-col w-full max-w-2xl justify-center items-center gap-3 mt-5">
        <h1>{country.name.common}</h1>

        <div className="flex flex-row gap-2">
          <Button onClick={finishDrawing}>Done</Button>
          <Button variant="secondary" onClick={rollNewCountry}>
            Skip Country
          </Button>
        </div>

        <DrawingCanvas ref={canvasRef} aspectRatio={flagAspect} />
      </div>

      <div className="flex flex-col w-full justify-center items-center gap-3 mt-5">
        <h2 className="text-2xl">Game History</h2>
        {gameHistory.map((game, index) => (
          <div key={index} className="flex flex-col items-center">
            <h2 className="font-bold">{game.country.name}</h2>
            <p className="font-semibold">Accuracy: {game.accuracy.toFixed(2)}%</p>
            <div className="flex flex-row gap-2">
              <img src={game.country.flag} alt={`${game.country.name} flag`} className="w-[20rem]" />
              <img src={game.userDrawing} alt={`${game.country.name} flag`} className="w-[20rem]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
