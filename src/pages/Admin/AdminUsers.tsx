import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import Button from '../../components/common/Button'
import useAdminUsers from '../../hooks/useAdminUsers'


export default function AdminUsers() {
  const navigate = useNavigate()
  const {
    users,
    loading,
    editing,
    formState,
    setFormState,
    handleEdit,
    handleCancel,
    handleSave,
    handleDelete,
    validateEmail,
    validatePhone,
    validateAddress,
    isFormValid,
    page,
    setPage,
    totalPages,
  } = useAdminUsers()

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) navigate('/admin')
  }, [navigate])

  if (loading) return (
    <AdminLayout>
      <div>Loading users...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Internal Users</h1>
        <div>
          <Button onClick={() => { localStorage.removeItem('isAdmin'); navigate('/') }} className="bg-gray-800">Sign out</Button>
        </div>
      </div>

      <div className="mt-4 bg-white rounded shadow overflow-x-auto">
        <div className="p-4 flex justify-center">
          <div className="inline-flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 border ${page === 1 ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white'}`}
            >
              ←
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1
              return (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 border ${page === p ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 border ${page === totalPages ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white'}`}
            >
              →
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Shipping Address</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.firstName} {u.lastName}</div>
                </td>
                <td className="px-4 py-3">
                  {editing[u.id] ? (
                    <input
                      className={`border px-2 py-1 w-64 ${!validateEmail(formState[u.id]?.email) ? 'border-red-500' : ''}`}
                      value={formState[u.id]?.email ?? ''}
                      onChange={(e) => setFormState((s) => ({ ...s, [u.id]: { ...(s[u.id] ?? {}), email: e.target.value } }))}
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>{u.username}</div>
                </td>
                <td className="px-4 py-3">
                  {editing[u.id] ? (
                    <input
                      className={`border px-2 py-1 w-40 ${!validatePhone(formState[u.id]?.phoneNumber) ? 'border-red-500' : ''}`}
                      value={formState[u.id]?.phoneNumber ?? ''}
                      onChange={(e) => setFormState((s) => ({ ...s, [u.id]: { ...(s[u.id] ?? {}), phoneNumber: e.target.value } }))}
                    />
                  ) : (
                    u.phoneNumber
                  )}
                </td>
                <td className="px-4 py-3">
                  {editing[u.id] ? (
                    <input
                      className={`border px-2 py-1 w-64 ${!validateAddress(formState[u.id]?.shippingAddresses?.find((a) => a.isDefault)?.shippingAddress ?? formState[u.id]?.shippingAddresses?.[0]?.shippingAddress) ? 'border-red-500' : ''}`}
                      value={formState[u.id]?.shippingAddresses?.find((a) => a.isDefault)?.shippingAddress ?? formState[u.id]?.shippingAddresses?.[0]?.shippingAddress ?? ''}
                      onChange={(e) => setFormState((s) => ({
                        ...s,
                        [u.id]: {
                          ...(s[u.id] ?? {}),
                          shippingAddresses: [
                            {
                              ...(s[u.id]?.shippingAddresses?.find((a) => a.isDefault) ?? s[u.id]?.shippingAddresses?.[0] ?? {}),
                              shippingAddress: e.target.value,
                              isDefault: true,
                            },
                          ],
                        },
                      }))}
                    />
                  ) : (
                    (u.shippingAddresses && u.shippingAddresses.length > 0)
                      ? (u.shippingAddresses.find((a) => a.isDefault)?.shippingAddress || u.shippingAddresses[0].shippingAddress)
                      : '—'
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {editing[u.id] ? (
                      <>
                        <Button
                          onClick={() => handleSave(u.id)}
                          disabled={!isFormValid(String(u.id))}
                          className={`${!isFormValid(String(u.id)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Save
                        </Button>
                        <Button onClick={() => handleCancel(u.id)} className="bg-gray-500">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleEdit(u.id)}>Edit</Button>
                        <Button onClick={() => handleDelete(u.id)} className="bg-red-600">Delete</Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
