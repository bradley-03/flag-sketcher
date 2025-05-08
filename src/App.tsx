import countryData from "../data/countryData.json"
import { useState, useRef } from "react"
import DrawingCanvas from "./components/DrawingCanvas/DrawingCanvas"
import { CanvasRefHandle } from "./components/DrawingCanvas/CanvasCore"

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

  return (
    <>
      {/* <button onClick={rollNewCountry}>New Country</button>
      <div>
        <h1 className="text-red-500">
          {country.name.common} {country.flag}
        </h1>
        <img src={country.flags.png} alt={country.flags.alt} />
      </div> */}
      <div className="flex w-full h-screen justify-center items-center">
        <DrawingCanvas ref={canvasRef} />
      </div>
    </>
  )
}

export default App
