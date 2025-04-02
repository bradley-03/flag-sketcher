import fs from "fs"

const API_URL = "https://restcountries.com/v3.1/all?fields=name,flags,flag"
const OUTPUT_DIR = "./data"

async function fetchData() {
  try {
    console.log("Fetching country data..")

    const res = await fetch(API_URL)
    const data = await res.json()

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR)
    }

    fs.writeFileSync(`${OUTPUT_DIR}/countryData.json`, JSON.stringify(data, null, 2))
    console.log("Successfully wrote data to file!")
  } catch (error) {
    console.error(`Error fetching country data: ${error}`)
  }
}

fetchData()
