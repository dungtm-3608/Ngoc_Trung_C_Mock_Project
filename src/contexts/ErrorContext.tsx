import { createContext, useCallback, useEffect, useState } from 'react'
import ErrorDialog from '../components/common/ErrorDialog'

type ErrorContextValue = {
  showError: (message: string) => void
}

const ErrorContext = createContext<ErrorContextValue | null>(null)

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('')

  const showError = useCallback((msg: string) => {
    setMessage(String(msg || 'Có lỗi xảy ra'))
  }, [])

  useEffect(() => {
    // expose a global hook so non-react utils can show errors
    ;(window as any).__showAppError = showError
    return () => {
      try {
        delete (window as any).__showAppError
      } catch {
        ;(window as any).__showAppError = undefined
      }
    }
  }, [showError])

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {message ? <ErrorDialog message={message} onClose={() => setMessage('')} /> : null}
    </ErrorContext.Provider>
  )
}

export default ErrorContext
