import axios from 'axios'

type HandleErrorOptions = {
  userMessage?: string
}

export function normalizeErrorMessage(err: unknown): string {
  if (!err) return 'Có lỗi xảy ra'
  // axios error with response
  if (axios.isAxiosError(err)) {
    const res = (err as any).response
    if (res && res.data) {
      const data = res.data
      if (typeof data === 'string') return data
      if (data.message) return String(data.message)
    }
    return err.message || 'Lỗi khi thực hiện yêu cầu'
  }
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try {
    return JSON.stringify(err)
  } catch {
    return 'Có lỗi xảy ra'
  }
}

export default function handleError(err: unknown, options?: HandleErrorOptions) {
  const message = options?.userMessage ?? normalizeErrorMessage(err)
  // log full error for debugging
  // eslint-disable-next-line no-console
  console.error('handleError:', err)

  // prefer the global handler set by ErrorProvider
  const globalShow = (window as any).__showAppError as ((m: string) => void) | undefined
  if (typeof globalShow === 'function') {
    try {
      globalShow(message)
      return
    } catch (e) {
      // fallback to alert
    }
  }

  // final fallback
  try {
    // eslint-disable-next-line no-alert
    alert(message)
  } catch {
    // noop
  }
}
