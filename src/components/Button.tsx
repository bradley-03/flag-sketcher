import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "danger" | "link" | "ghost"
  size?: "regular" | "medium" | "large" | "icon"
}

const baseButtonStyles =
  "inline-flex justify-center items-center gap-2 font-semibold rounded-md transition cursor-pointer disabled:cursor-default shadow"

const variantStyles = {
  primary:
    "dark:bg-white dark:text-black dark:enabled:hover:bg-neutral-300 bg-black text-white hover:enabled:bg-neutral-800 dark:disabled:bg-neutral-300 dark:disabled:text-neutral-600 disabled:bg-neutral-600 disabled:text-neutral-300",
  secondary:
    "dark:bg-neutral-800 dark:hover:enabled:bg-neutral-700 dark:text-white bg-neutral-200 hover:enabled:bg-neutral-100 text-neutral-950 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-600",
  outline:
    "dark:bg-black dark:text-white bg-white text-black border-1 dark:border-neutral-600 dark:hover:enabled:bg-neutral-600 border-neutral-300 hover:enabled:bg-neutral-300 shadow-sm dark:disabled:text-neutral-500 disabled:text-neutral-600",
  danger:
    "dark:bg-red-800 dark:hover:enabled:bg-red-700 bg-red-700 hover:enabled:bg-red-600 text-white dark:disabled:bg-red-400 dark:disabled:text-neutral-200 disabled:bg-red-400 disabled:text-neutral-200",
  link: "bg-none border-none dark:text-white hover:enabled:underline shadow-none text-black dark:disabled:text-neutral-500 disabled:text-neutral-600",
  ghost:
    "shadow-none bg-none dark:enabled:hover:bg-neutral-800 dark:text-white text-black enabled:hover:bg-neutral-300 disabled:text-neutral-600 dark:disabled:text-neutral-500",
}

const sizeStyles = {
  regular: "px-4 py-2 h-9",
  medium: "px-6 py-3 text-lg",
  large: "px-8 py-4 text-xl",
  icon: "h-9 w-9 px-0 py-0",
}

export default function Button({ children, variant = "primary", size = "regular", ...props }: ButtonProps) {
  const buttonStyles = `${baseButtonStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${props.className || ""}`

  return (
    <button {...props} className={buttonStyles}>
      {children}
    </button>
  )
}
