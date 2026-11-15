import type { ReactNode } from 'react'

type IconButtonVariant = 'default' | 'primary' | 'danger'

interface IconButtonProps {
  onClick: () => void
  title: string
  children: ReactNode
  variant?: IconButtonVariant
}

const VARIANT_CLASS_NAMES: Record<IconButtonVariant, string> = {
  default: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  primary: 'bg-red-500 hover:bg-red-600 text-white shadow-md',
  danger: 'bg-red-100 hover:bg-red-200 text-red-600',
}

export function IconButton({ onClick, title, children, variant = 'default' }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${VARIANT_CLASS_NAMES[variant]}`}
    >
      {children}
    </button>
  )
}
