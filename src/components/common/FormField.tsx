import type { InputHTMLAttributes, ReactNode } from 'react'

type FormFieldProps = {
  label: string
  error?: string
  isErrorVisible: boolean
  errorId: string
  children?: ReactNode
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

export default function FormField({
  label,
  error = '',
  isErrorVisible,
  errorId,
  children,
  inputProps,
}: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm text-neutral-700">
      <span>{label}</span>
      <input
        {...inputProps}
        aria-invalid={isErrorVisible && Boolean(error)}
        aria-describedby={isErrorVisible && error ? errorId : undefined}
      />
      {children}
      {isErrorVisible && error ? <span id={errorId} className="text-xs text-red-600">{error}</span> : null}
    </label>
  )
}