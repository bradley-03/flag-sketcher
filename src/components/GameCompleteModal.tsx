import Modal from "./Modal"
import { FlagImg } from "./GameHistoryItem"
import { GameHistory } from "../App"
import Button from "./Button"

type GameCompleteModalProps = {
  isOpen: boolean
  onClose: () => void
  game: GameHistory
}

export default function GameCompleteModal({ isOpen, onClose, game }: GameCompleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={!game?.userDrawing && !game?.accuracy ? "Skipped!" : "Complete!"}>
      {game ? (
        <div>
          <div className="flex gap-2 justify-center">
            <div className="flex flex-col gap-1">
              <FlagImg src={game.country.flag} alt="Country Flag" />
              <h2 className="text-center">{game.country.name} Flag</h2>
            </div>
            {game.userDrawing && (
              <div className="flex flex-col gap-1">
                <FlagImg src={game.userDrawing} alt="Your Flag" />
                <h2 className="text-center">Your drawing</h2>
              </div>
            )}
          </div>

          <p className="my-3 text-center">
            Your accuracy:{" "}
            <span className="font-bold">
              {!game.accuracy ? (game.userDrawing ? "N/A" : "Skipped!") : `${game.accuracy.toFixed(2)}%`}
            </span>
          </p>
        </div>
      ) : (
        <p>Something went wrong grabbing recent game!</p>
      )}
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Next Country</Button>
      </div>
    </Modal>
  )
}
