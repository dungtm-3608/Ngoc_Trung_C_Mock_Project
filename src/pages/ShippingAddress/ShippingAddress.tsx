import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import type { ShippingAddress } from '../../types/shippingAddress'
import { deleteShippingAddress, getShippingAddressesForUser, saveShippingAddress } from '../../services/shippingAddressService'
function emptyProfile(userId: string): ShippingAddress {
  return {
    id: String(Date.now()),
    userId,
    label: 'Địa chỉ mới',
    customerName: '',
    phoneNumber: '',
    shippingAddress: '',
    isDefault: false,
  }
}

export default function ShippingAddressPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [editing, setEditing] = useState<ShippingAddress | null>(null)
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([])

  const reloadProfiles = async () => {
    if (!user) {
      setShippingAddresses([])
      return
    }
    const list = await getShippingAddressesForUser(user.id)
    setShippingAddresses(list)
  }

  // load profiles when user changes
  useMemo(() => {
    // fire-and-forget; reloadProfiles updates state when ready
    void reloadProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-4">Bạn cần đăng nhập để quản lý địa chỉ.</div>
        <Link to="/login" className="text-amber-600">Đăng nhập</Link>
      </main>
    )
  }

  const startNew = () => setEditing(emptyProfile(user.id))

  const handleSave = async (profile: ShippingAddress) => {
    await saveShippingAddress(user.id, profile)
    setEditing(null)
    await reloadProfiles()
  }

  const handleDelete = async (id: string) => {
    await deleteShippingAddress(user.id, id)
    setEditing((current) => (current && current.id === id ? null : current))
    await reloadProfiles()
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Địa chỉ giao hàng</h1>
        <div>
          <button onClick={() => navigate(-1)} className="mr-3 text-sm text-neutral-600">Quay lại</button>
          <button onClick={startNew} className="px-3 py-1 bg-amber-500 text-white rounded text-sm">Thêm địa chỉ</button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          {shippingAddresses.length === 0 && <div className="text-sm text-neutral-500">Bạn chưa lưu địa chỉ nào.</div>}
          {shippingAddresses.map((p) => (
            <div key={p.id} className="mb-4 border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{p.label || 'Địa chỉ'}</div>
                  <div className="text-sm text-neutral-600">{p.customerName} • {p.phoneNumber}</div>
                </div>
                <div className="text-right">
                  {p.isDefault && <div className="text-xs text-amber-600">Mặc định</div>}
                  <div className="mt-2">
                    <button onClick={() => setEditing(p)} className="text-sm mr-2">Sửa</button>
                    <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600">Xóa</button>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-neutral-700">{p.shippingAddress}</div>
            </div>
          ))}
        </div>

        <div>
          {editing ? (
            <ShippingAddressEditor profile={editing} onCancel={() => setEditing(null)} onSave={handleSave} />
          ) : (
            <div className="text-sm text-neutral-500">Chọn một địa chỉ để sửa, hoặc thêm địa chỉ mới.</div>
          )}
        </div>
      </div>
    </main>
  )
}

function ShippingAddressEditor({ profile, onCancel, onSave }: { profile: ShippingAddress; onCancel: () => void; onSave: (profile: ShippingAddress) => void }) {
  const [draft, setDraft] = useState<ShippingAddress>(profile)

  const digitsOnly = (value: string) => value.replace(/\D/g, '')

  const sanitizePhoneInput = (value: string) => {
    const digits = digitsOnly(value || '')
    return (value || '').trim().startsWith('+') ? `+${digits}` : digits
  }

  const isPhoneValid = () => {
    const digits = digitsOnly(draft.phoneNumber || '')
    return digits.length >= 9 && digits.length <= 11
  }

  const isNotEmpty = (value: string | undefined) => !!(value && value.trim())

  const isFormValid = isNotEmpty(draft.label) && isNotEmpty(draft.customerName) && isPhoneValid() && isNotEmpty(draft.shippingAddress)

  const save = () => {
    if (!isFormValid) return
    onSave(draft)
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <div className="text-sm">Nhãn</div>
        <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} className="mt-1 w-full border rounded p-2" />
      </label>
      <label className="block">
        <div className="text-sm">Tên người nhận</div>
        <input value={draft.customerName} onChange={(e) => setDraft({ ...draft, customerName: e.target.value })} className="mt-1 w-full border rounded p-2" />
      </label>
      <label className="block">
        <div className="text-sm">Số điện thoại</div>
        <input
          value={draft.phoneNumber}
          onChange={(e) => setDraft({ ...draft, phoneNumber: sanitizePhoneInput(e.target.value) })}
          className="mt-1 w-full border rounded p-2"
        />
      </label>
      <label className="block">
        <div className="text-sm">Địa chỉ</div>
        <textarea value={draft.shippingAddress} onChange={(e) => setDraft({ ...draft, shippingAddress: e.target.value })} className="mt-1 w-full border rounded p-2" />
      </label>
      <label className="inline-flex items-center">
        <input type="checkbox" checked={!!draft.isDefault} onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })} />
        <span className="ml-2 text-sm">Đặt làm mặc định</span>
      </label>
      <div className="space-x-2">
        <button
          onClick={save}
          disabled={!isFormValid}
          className={`px-3 py-1 rounded ${isFormValid ? 'bg-amber-500 text-white' : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'}`}
        >
          Lưu
        </button>
        <button onClick={onCancel} className="px-3 py-1 border rounded">Hủy</button>
      </div>
    </div>
  )
}
