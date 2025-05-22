import countryData from "../data/countryData.json"
import { useState, useRef, useEffect } from "react"
import DrawingCanvas from "./components/DrawingCanvas/DrawingCanvas"
import { CanvasRefHandle } from "./components/DrawingCanvas/CanvasCore"
import Button from "./components/Button"
import { compareImages, getImageAspectRatio } from "./util/compareImages"
import GameHistoryItem from "./components/GameHistoryItem"
import { FaGithub } from "react-icons/fa"
import { RxCross1 } from "react-icons/rx"
import { Tooltip } from "react-tooltip"
import Modal from "./components/Modal"

export type GameHistory = {
  country: {
    name: string
    flag: string
  }
  userDrawing: string | null
  accuracy: number | null
}

function getRandomCountryIndex(): number {
  return Math.floor(Math.random() * countryData.length)
}

function App() {
  const [randomCountryIndex, setRandomCountryIndex] = useState<number>(getRandomCountryIndex())
  const [flagAspect, setFlagAspect] = useState<number>(3 / 2)
  const canvasRef = useRef<CanvasRefHandle>(null)
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  const [finishedModal, setFinishedModal] = useState<boolean>(false)

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
    setFinishedModal(true)
  }

  function handleSkip() {
    setGameHistory(prev => [
      ...prev,
      {
        country: {
          name: country.name.common,
          flag: country.flags.png,
        },
        userDrawing: null,
        accuracy: null,
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
    <div className="flex flex-col w-full justify-center items-center text-center my-4 text-[#283618]">
      <Modal isOpen={finishedModal} onClose={() => setFinishedModal(false)} title="Complete">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">You finished drawing!</h2>
          <p className="text-neutral-600">
            Your accuracy: {gameHistory[gameHistory.length - 1]?.accuracy?.toFixed(2)}%
          </p>
          <Button onClick={() => setFinishedModal(false)}>Close</Button>
        </div>
      </Modal>

      <div className="flex flex-col w-full max-w-2xl justify-center items-center gap-3 mt-5">
        <h1 className="font-bold">{country.name.common}</h1>

        <div className="flex flex-row gap-2">
          <Button onClick={finishDrawing}>Done</Button>
          <Button variant="secondary" onClick={handleSkip}>
            Skip Country
          </Button>
        </div>

        <DrawingCanvas ref={canvasRef} aspectRatio={flagAspect} />
      </div>

      <div className="flex flex-col w-full max-w-2xl justify-center items-center gap-3 mt-5 mb-5">
        <div className="flex gap-2 items-center">
          <Tooltip id="clearTooltip">Clear History</Tooltip>
          <h2 className="text-3xl font-bold">Game History</h2>
          <Button data-tooltip-id="clearTooltip" size="icon" variant="ghost" onClick={() => setGameHistory([])}>
            <RxCross1 />
          </Button>
        </div>
        {gameHistory.map((game, index) => (
          <GameHistoryItem key={index} game={game} />
        ))}
      </div>

      <div className="flex flex-col w-full max-w-2xl justify-center items-center mt-5 mb-5">
        <p className="text-neutral-600">Made with ❤️</p>
        <a
          target="_blank"
          className="text-black hover:underline flex gap-1 items-center"
          href="https://github.com/bradley-03/flag-sketcher"
        >
          <FaGithub /> Github
        </a>
      </div>
    </div>
  )
}

export default App
