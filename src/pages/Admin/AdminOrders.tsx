import AdminLayout from './AdminLayout'
import Button from '../../components/common/Button'
import useAdminOrders from '../../hooks/useAdminOrders'

export default function AdminOrders() {
  const {
    loading,
    filter,
    setFilter,
    editingStatus,
    handleStatusChange,
    saveStatus,
    filtered,
    STATUS_LABELS,
    page,
    setPage,
    totalPages,
  } = useAdminOrders()

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Order Manager</h1>
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
        <div className="p-4 border-b">
          <div className="flex gap-2">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <button key={key} className={`px-3 py-2 rounded ${filter === key ? 'bg-slate-900 text-white' : 'bg-white border'}`} onClick={() => setFilter(key)}>{label}</button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Ngày đặt</th>
                <th className="px-4 py-3">Số SP</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Tình trạng</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-4 py-3 font-semibold">#{String(o.id)}</td>
                  <td className="px-4 py-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{o.items?.length ?? 0}</td>
                  <td className="px-4 py-3">{o.total}đ</td>
                  <td className="px-4 py-3">
                    <select value={editingStatus[String(o.id)] ?? o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="border px-2 py-1">
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="delivering">Đang giao</option>
                      <option value="delivered">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button onClick={() => saveStatus(o.id)}>Save</Button>
                      <Button onClick={() => alert(JSON.stringify(o, null, 2))} className="bg-gray-500">Chi tiết</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
