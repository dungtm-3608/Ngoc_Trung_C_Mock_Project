import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import categoryService, { CategoryRecord } from '../../services/categoryService'
import Button from '../../components/common/Button'

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await categoryService.getCategories()
      setCategories(data)
    } catch (err) {
      console.error('fetch categories', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) return
    try {
      await categoryService.createCategory({ name })
      setNewName('')
      await fetchCategories()
    } catch (err) {
      console.error('create category', err)
    }
  }

  const startEdit = (c: CategoryRecord) => {
    setEditingId(c.id)
    setEditValue(c.name)
  }

  const saveEdit = async (id: string) => {
    const name = editValue.trim()
    if (!name) return
    try {
      await categoryService.updateCategory(id, { name })
      setEditingId(null)
      setEditValue('')
      await fetchCategories()
    } catch (err) {
      console.error('update category', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    try {
      await categoryService.deleteCategory(id)
      await fetchCategories()
    } catch (err) {
      console.error('delete category', err)
    }
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Categories Manager</h1>
          <div className="flex gap-2">
            <input className="border px-2 py-1" placeholder="New category" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>

        <p className="text-sm text-neutral-600 mt-2">Manage categories used by products.</p>

        <div className="mt-4 bg-white rounded shadow overflow-x-auto">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-3">
                      {editingId === c.id ? (
                        <input className="border px-2 py-1 w-64" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="px-4 py-3">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {editingId === c.id ? (
                          <>
                            <Button onClick={() => saveEdit(c.id)}>Save</Button>
                            <Button onClick={() => { setEditingId(null); setEditValue('') }} className="bg-gray-500">Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => startEdit(c)}>Edit</Button>
                            <Button onClick={() => handleDelete(c.id)} className="bg-red-600">Delete</Button>
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
      </div>
    </AdminLayout>
  )
}
