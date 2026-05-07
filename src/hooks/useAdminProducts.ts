import { useEffect, useState } from 'react'
import axiosClient from '../services/axiosClient'
import handleError from '../utils/handleError'
import type { Wine } from '../types/wine'

type PaginatedWinesResponse = {
  data?: Wine[]
  items?: number
  pages?: number
}

export default function useAdminProducts() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<Partial<Wine>>({})
  const [tagEdit, setTagEdit] = useState<Record<string, { newColor?: string; newSize?: string }>>({})
  const [page, setPage] = useState<number>(1)
  const perPage = 20
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => { fetchWines(page) }, [page])

  const fetchWines = async (p = 1) => {
    setLoading(true)
    try {
      const res = await axiosClient.get('/wines', { params: { _page: p, _per_page: perPage } })
      const payload = res.data as Wine[] | PaginatedWinesResponse
      const nextWines = Array.isArray(payload) ? payload : (payload.data ?? [])
      const totalCount = Array.isArray(payload) ? payload.length : (payload.items ?? nextWines.length)
      const nextTotalPages = Array.isArray(payload) ? Math.max(1, Math.ceil(totalCount / perPage)) : (payload.pages ?? Math.max(1, Math.ceil(totalCount / perPage)))

      setWines(nextWines)
      setTotalPages(nextTotalPages)
    } catch (err) {
      handleError(err, { userMessage: 'Không thể tải sản phẩm' })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (wine: Wine) => {
    setEditingId(wine.id)
    setFormState({ ...wine })
    setTagEdit((s) => ({ ...s, [wine.id]: { newColor: '', newSize: '' } }))
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormState({})
  }

  const handleSave = async () => {
    if (!formState) return
    try {
      if (editingId) {
        await axiosClient.patch(`/wines/${editingId}`, formState)
      } else {
        await axiosClient.post('/wines', { ...formState, id: String(Date.now()) })
      }
      await fetchWines()
      handleCancel()
    } catch (err) {
      handleError(err, { userMessage: 'Không thể lưu sản phẩm' })
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!confirm('Delete this wine?')) return
    try {
      await axiosClient.delete(`/wines/${id}`)
      setWines((s) => s.filter((w) => w.id !== id))
    } catch (err) {
      handleError(err, { userMessage: 'Không thể xóa sản phẩm' })
    }
  }

  const handleCreate = () => {
    setEditingId(null)
    setFormState({ name: '', categoryId: '', price: 0 })
    setTagEdit((s) => ({ ...s, new: { newColor: '', newSize: '' } }))
  }

  return {
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
    fetchWines,
    page,
    setPage,
    perPage,
    totalPages,
  }
}
