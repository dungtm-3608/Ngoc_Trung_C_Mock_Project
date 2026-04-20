import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700 ${className}`.trim()}
      type={type}
    />
  )
}
