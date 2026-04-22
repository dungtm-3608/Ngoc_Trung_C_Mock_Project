import type { ReactNode } from 'react'

type PaginationButtonProps = {
  isActive?: boolean
  onClick: () => void
  children: ReactNode
}

export default function PaginationButton({ isActive, onClick, children }: PaginationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center border px-3 text-sm transition ${isActive ? 'border-amber-500 bg-amber-500 text-white' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800'}`}
    >
      {children}
    </button>
  )
}
