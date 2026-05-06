type ErrorDialogProps = {
  message: string
  onClose: () => void
}

export default function ErrorDialog({ message, onClose }: ErrorDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-neutral-900">Lỗi</h3>
        <p className="mt-3 text-sm text-neutral-700">{message}</p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
