import { GameHistory } from "../../App"

type GameHistoryItemProps = {
  game: GameHistory
}

export default function GameHistoryItem({ game }: GameHistoryItemProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-bold">{game.country.name}</h2>
      <p className="font-semibold">Accuracy: {game.accuracy.toFixed(2)}%</p>
      <div className="flex gap-2">
        <div className="flex justify-center">
          <img
            src={game.country.flag}
            alt={`${game.country.name} flag`}
            className="max-w-[20rem] w-full h-auto object-contain rounded"
          />
        </div>
        <div className="flex justify-center">
          <img
            src={game.userDrawing}
            alt={`${game.country.name} flag`}
            className="max-w-[20rem] w-full h-auto object-contain rounded"
          />
        </div>
      </div>
    </div>
  )
}
