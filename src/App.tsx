import countryData from "../data/countryData.json"
import { useState, useRef } from "react"
import DrawingCanvas from "./components/DrawingCanvas/DrawingCanvas"
import { CanvasRefHandle } from "./components/DrawingCanvas/CanvasCore"
import Button from "./components/Button"
import { compareImages } from "./util/compareImages"

function getRandomCountryIndex(): number {
  return Math.floor(Math.random() * countryData.length)
}

function App() {
  const [randomCountryIndex, setRandomCountryIndex] = useState<number>(getRandomCountryIndex())
  const canvasRef = useRef<CanvasRefHandle>(null)

  function rollNewCountry() {
    setRandomCountryIndex(getRandomCountryIndex())
    canvasRef.current?.reset()
  }

  const country = countryData[randomCountryIndex]

  function exportTest() {
    const imgBase64 = canvasRef.current?.exportImg()
    if (!imgBase64) return
    compareImages(imgBase64, country.flags.png)
  }

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center gap-3 mt-5">
        <button onClick={rollNewCountry}>New Country</button>
        <h1>{country.name.common}</h1>

        <Button onClick={exportTest}>Test Button</Button>
        <DrawingCanvas ref={canvasRef} />
      </div>
    </>
  )
}

export default App
