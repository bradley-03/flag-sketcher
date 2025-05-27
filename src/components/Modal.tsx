import { createPortal } from "react-dom"
import { RxCross2 } from "react-icons/rx"
import Button from "./Button"
import { AnimatePresence, motion } from "motion/react"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // if (!isOpen) return null

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 overflow-y-auto z-10"
          onMouseDown={handleMouseDown}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -7 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 30, rotate: 7, transition: { duration: 0.2 } }}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modals") as HTMLElement
  )
}
