import { useEffect, useState } from 'react'
import axiosClient from '../services/axiosClient'
import wineService from '../services/wineService'
import categoryService from '../services/categoryService'
import handleError from '../utils/handleError'
import type { Wine } from '../types/wine'

export default function useAdminCategories() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [selectedWineIds, setSelectedWineIds] = useState<string[]>([])
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [allCategories, setAllCategories] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => { fetchWines() }, [])

  const fetchWines = async () => {
    setLoading(true)
    try {
      const [data, cats] = await Promise.all([wineService.getWines(), categoryService.getCategories()])
      setWines(data)
      setAllCategories(cats)
    } catch (err) {
      handleError(err, { userMessage: 'Không thể tải danh sách rượu hoặc danh mục' })
    } finally {
      setLoading(false)
    }
  }

  // categories come from categoryService (id + name)
  const categories = allCategories.map((c) => c.name).sort()

  const handleAssign = async (categoryId: string) => {
    if (!categoryId || selectedWineIds.length === 0) return
    try {
      await Promise.all(selectedWineIds.map((id) => axiosClient.patch(`/wines/${id}`, { categoryId })))
      setSelectedWineIds([])
      await fetchWines()
    } catch (err) {
      handleError(err, { userMessage: 'Không thể gán danh mục' })
    }
  }

  const handleCreateAndAssign = async () => {
    const categoryName = newCategory.trim()
    if (!categoryName || selectedWineIds.length === 0) return
    try {
      const created = await categoryService.createCategory({ name: categoryName })
      await Promise.all(selectedWineIds.map((id) => axiosClient.patch(`/wines/${id}`, { categoryId: created.id })))
      setNewCategory('')
      setSelectedWineIds([])
      await fetchWines()
    } catch (err) {
      handleError(err, { userMessage: 'Không thể tạo và gán danh mục' })
    }
  }

  const handleRename = async (oldName: string) => {
    const newName = editValue.trim()
    if (!newName) return
    const category = allCategories.find((c) => c.name === oldName)
    if (!category) return
    if (!confirm(`Rename category "${oldName}" to "${newName}"?`)) return
    try {
      await categoryService.updateCategory(category.id, { name: newName })
      setEditingCategory(null)
      setEditValue('')
      await fetchWines()
    } catch (err) {
      handleError(err, { userMessage: 'Không thể đổi tên danh mục' })
    }
  }

  const handleDelete = async (categoryName: string) => {
    const category = allCategories.find((c) => c.name === categoryName)
    if (!category) return
    if (!confirm(`Delete category "${categoryName}" and unset it from all related wines?`)) return
    try {
      const affected = wines.filter((w) => w.categoryId === category.id)
      await Promise.all(affected.map((w) => axiosClient.patch(`/wines/${w.id}`, { categoryId: '' })))
      await categoryService.deleteCategory(category.id)
      await fetchWines()
    } catch (err) {
      handleError(err, { userMessage: 'Không thể xóa danh mục' })
    }
  }

  return {
    wines,
    loading,
    newCategory,
    setNewCategory,
    selectedWineIds,
    setSelectedWineIds,
    editingCategory,
    setEditingCategory,
    editValue,
    setEditValue,
    categories,
    handleAssign,
    handleCreateAndAssign,
    handleRename,
    handleDelete,
    fetchWines,
  }
}
