import { createPortal } from "react-dom"
import { RxCross2 } from "react-icons/rx"
import Button from "./Button"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 overflow-y-auto z-10"
      onMouseDown={handleMouseDown}
    >
      <div
        className="dotsBg dark:bg-black dark:border-1 dark:border-neutral-600 dark:text-white text-black p-6 rounded-md shadow-lg overflow-y-auto max-h-[90vh] w-full md:w-3/5 lg:w-2/5"
        // onMouseDown={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <Button onClick={onClose} size="icon" variant="ghost">
            <RxCross2 />
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.getElementById("modals") as HTMLElement
  )
}
