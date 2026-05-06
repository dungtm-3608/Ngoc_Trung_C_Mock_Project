import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import Button from '../../components/common/Button'
import useAdminProducts from '../../hooks/useAdminProducts'
import categoryService, { CategoryRecord } from '../../services/categoryService'
import { formatCurrency } from '../../utils/currencyUtil'

export default function AdminProducts() {
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const {
    wines,
    loading,
    editingId,
    formState,
    tagEdit,
    setFormState,
    setTagEdit,
    handleEdit,
    handleCancel,
    handleSave,
    handleDelete,
    handleCreate,
    page,
    setPage,
    totalPages,
  } = useAdminProducts()

  useEffect(() => {
    let active = true

    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        if (active) setCategories(data)
      } catch (err) {
        console.error('load categories', err)
      }
    }

    loadCategories()

    return () => {
      active = false
    }
  }, [])

  const renderCategoryName = (categoryId?: string) => {
    if (!categoryId) return '—'
    return categories.find((category) => category.id === categoryId)?.name ?? '—'
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product Manager</h1>
        <div>
          <Button onClick={handleCreate}>New Product</Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
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

      <div className="mt-4 bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formState && !editingId && formState.name !== undefined ? (
                <tr className="border-t">
                  <td className="px-4 py-3">
                    <input className="border px-2 py-1 w-64" value={formState.name ?? ''} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="border px-2 py-1 w-40"
                      value={formState.categoryId ?? ''}
                      onChange={(e) => setFormState((s) => ({ ...s, categoryId: e.target.value }))}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" className="border px-2 py-1 w-32" value={formState.price ?? 0} onChange={(e) => setFormState((s) => ({ ...s, price: Number(e.target.value) }))} />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" className="border px-2 py-1 w-20" value={formState.discount ?? 0} onChange={(e) => setFormState((s) => ({ ...s, discount: Number(e.target.value) }))} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <div>
                        <div className="text-xs font-semibold">Colors</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(formState.colors ?? []).map((c, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                              <span className="text-xs">{c}</span>
                              <button type="button" onClick={() => setFormState((s) => ({ ...(s ?? {}), colors: (s?.colors ?? []).filter((_, i) => i !== idx) }))} className="text-red-600 text-xs">x</button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <input className="border px-2 py-1 w-40" placeholder="Add color" value={tagEdit['new']?.newColor ?? ''} onChange={(e) => setTagEdit((t) => ({ ...t, new: { ...(t.new ?? {}), newColor: e.target.value } }))} />
                          <button type="button" onClick={() => {
                            const c = tagEdit['new']?.newColor?.trim()
                            if (c) setFormState((s) => ({ ...(s ?? {}), colors: [...(s?.colors ?? []), c] }))
                            setTagEdit((t) => ({ ...t, new: { ...(t.new ?? {}), newColor: '' } }))
                          }} className="bg-slate-900 text-white px-2 py-1 text-xs rounded">Add</button>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Sizes</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(formState.size ?? []).map((sV, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                              <span className="text-xs">{sV}</span>
                              <button type="button" onClick={() => setFormState((s) => ({ ...(s ?? {}), size: (s?.size ?? []).filter((_, i) => i !== idx) }))} className="text-red-600 text-xs">x</button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <input className="border px-2 py-1 w-40" placeholder="Add size" value={tagEdit['new']?.newSize ?? ''} onChange={(e) => setTagEdit((t) => ({ ...t, new: { ...(t.new ?? {}), newSize: e.target.value } }))} />
                          <button type="button" onClick={() => {
                            const sV = tagEdit['new']?.newSize?.trim()
                            if (sV) setFormState((s) => ({ ...(s ?? {}), size: [...(s?.size ?? []), sV] }))
                            setTagEdit((t) => ({ ...t, new: { ...(t.new ?? {}), newSize: '' } }))
                          }} className="bg-slate-900 text-white px-2 py-1 text-xs rounded">Add</button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>Create</Button>
                      <Button onClick={handleCancel} className="bg-gray-500">Cancel</Button>
                    </div>
                  </td>
                </tr>
              ) : null}
              {wines.map((w) => (
                <tr key={w.id} className="border-t">
                  <td className="px-4 py-3">
                    {editingId === w.id ? (
                      <input className="border px-2 py-1 w-64" value={formState.name ?? ''} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} />
                    ) : (
                      w.name
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === w.id ? (
                      <select
                        className="border px-2 py-1 w-40"
                        value={formState.categoryId ?? ''}
                        onChange={(e) => setFormState((s) => ({ ...s, categoryId: e.target.value }))}
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    ) : (
                      renderCategoryName(w.categoryId)
                    )}
                  </td>
                  <td className="px-4 py-3">{editingId === w.id ? (
                    <input type="number" className="border px-2 py-1 w-32" value={formState.price ?? 0} onChange={(e) => setFormState((s) => ({ ...s, price: Number(e.target.value) }))} />
                  ) : (
                    (formatCurrency(w.price) + 'đ')
                  )}</td>
                  <td className="px-4 py-3">{editingId === w.id ? (
                    <input type="number" className="border px-2 py-1 w-20" value={formState.discount ?? 0} onChange={(e) => setFormState((s) => ({ ...s, discount: Number(e.target.value) }))} />
                  ) : (
                    w.discount ?? 0
                  )}</td>
                  <td className="px-4 py-3">
                    {editingId === w.id ? (
                      <div className="flex flex-col gap-2">
                        <div>
                          <div className="text-xs font-semibold">Colors</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {(formState.colors ?? []).map((c, idx) => (
                              <div key={idx} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                <span className="text-xs">{c}</span>
                                <button type="button" onClick={() => setFormState((s) => ({ ...(s ?? {}), colors: (s?.colors ?? []).filter((_, i) => i !== idx) }))} className="text-red-600 text-xs">x</button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 flex gap-2">
                            <input className="border px-2 py-1 w-40" placeholder="Add color" value={tagEdit[w.id]?.newColor ?? ''} onChange={(e) => setTagEdit((t) => ({ ...t, [w.id]: { ...(t[w.id] ?? {}), newColor: e.target.value } }))} />
                            <button type="button" onClick={() => {
                              const c = tagEdit[w.id]?.newColor?.trim()
                              if (c) setFormState((s) => ({ ...(s ?? {}), colors: [...(s?.colors ?? []), c] }))
                              setTagEdit((t) => ({ ...t, [w.id]: { ...(t[w.id] ?? {}), newColor: '' } }))
                            }} className="bg-slate-900 text-white px-2 py-1 text-xs rounded">Add</button>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold">Sizes</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {(formState.size ?? []).map((sV, idx) => (
                              <div key={idx} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                <span className="text-xs">{sV}</span>
                                <button type="button" onClick={() => setFormState((s) => ({ ...(s ?? {}), size: (s?.size ?? []).filter((_, i) => i !== idx) }))} className="text-red-600 text-xs">x</button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 flex gap-2">
                            <input className="border px-2 py-1 w-40" placeholder="Add size" value={tagEdit[w.id]?.newSize ?? ''} onChange={(e) => setTagEdit((t) => ({ ...t, [w.id]: { ...(t[w.id] ?? {}), newSize: e.target.value } }))} />
                            <button type="button" onClick={() => {
                              const sV = tagEdit[w.id]?.newSize?.trim()
                              if (sV) setFormState((s) => ({ ...(s ?? {}), size: [...(s?.size ?? []), sV] }))
                              setTagEdit((t) => ({ ...t, [w.id]: { ...(t[w.id] ?? {}), newSize: '' } }))
                            }} className="bg-slate-900 text-white px-2 py-1 text-xs rounded">Add</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="text-xs font-semibold">Colors</div>
                        <div className="flex gap-2 flex-wrap">{(w.colors ?? []).map((c, i) => <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">{c}</span>)}</div>
                        <div className="text-xs font-semibold">Sizes</div>
                        <div className="flex gap-2 flex-wrap">{(w.size ?? []).map((sV, i) => <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">{sV}</span>)}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {editingId === w.id ? (
                        <>
                          <Button onClick={handleSave}>Save</Button>
                          <Button onClick={handleCancel} className="bg-gray-500">Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button onClick={() => handleEdit(w)}>Edit</Button>
                          <Button onClick={() => handleDelete(w.id)} className="bg-red-600">Delete</Button>
                        </>
                      )}
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
