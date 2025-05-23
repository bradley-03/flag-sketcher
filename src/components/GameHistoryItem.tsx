import { GameHistory } from "../App"

type GameHistoryItemProps = {
  game: GameHistory
}

export function FlagImg({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex justify-center">
      <img src={src} alt={alt} className="max-w-[19rem] w-full h-auto object-contain rounded shadow" />
    </div>
  )
}

export default function GameHistoryItem({ game }: GameHistoryItemProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-bold">{game.country.name}</h2>
      {game.accuracy ? (
        <p className="font-semibold">Accuracy: {game.accuracy.toFixed(2)}%</p>
      ) : (
        <p className="font-semibold">Skipped!</p>
      )}

      <div className="flex gap-2">
        <FlagImg src={game.country.flag} alt={`${game.country.name} flag`} />
        {game.userDrawing && <FlagImg src={game.userDrawing} alt={`${game.country.name} drawn flag`} />}
      </div>
    </div>
  )
}
