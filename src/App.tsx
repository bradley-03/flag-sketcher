import "./App.css"
import countryData from "../data/countryData.json"
import { useState } from "react"

function getRandomCountryIndex(): number {
  return Math.floor(Math.random() * countryData.length)
}

function App() {
  const [randomCountryIndex, setRandomCountryIndex] = useState<number>(getRandomCountryIndex())

  function rollNewCountry() {
    setRandomCountryIndex(getRandomCountryIndex())
  }

  const country = countryData[randomCountryIndex]

  return (
    <>
      <button onClick={rollNewCountry}>New Country</button>
      <div>
        <h1>
          {country.name.common} {country.flag}
        </h1>
        <img src={country.flags.png} alt={country.flags.alt} />
      </div>
    </>
  )
}

export default App
