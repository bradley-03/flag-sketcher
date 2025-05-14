# flag-sketcher

A fun web game where you try to draw the flags of the world from memory, and get scored on your accuracy to the real flag!

## Setup

**1. Clone the repository:**

```bash
git clone git@github.com:bradley-03/flag-sketcher.git
cd flag-sketcher
```

**2. Install dependencies:**

```bash
npm install
```

**3. Populate country data:**

This game needs country data to work.
Run the custom fetch script:

```bash
npm run fetch-data
```

This creates / updates `data/countryData.json`.

**4. Run the app:**

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [pixelmatch](https://www.npmjs.com/package/pixelmatch/v/1.1.0)
- [Jimp](https://www.npmjs.com/package/jimp)

## Todo / Ideas

- Shareable results
- Challenge friends

## Acknowledgements

- [Rest Countries API](https://restcountries.com)
