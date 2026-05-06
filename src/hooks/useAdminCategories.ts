import { useEffect, useState } from 'react'
import axiosClient from '../services/axiosClient'
import wineService from '../services/wineService'
import type { Wine } from '../types/wine'

export default function useAdminCategories() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [selectedWineIds, setSelectedWineIds] = useState<string[]>([])
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => { fetchWines() }, [])

  const fetchWines = async () => {
    setLoading(true)
    try {
      const data = await wineService.getWines()
      setWines(data)
    } finally {
      setLoading(false)
    }
  }

  const categories = Array.from(new Set(wines.map((w) => (w.category ?? '').trim()).filter(Boolean))).sort()

  const handleAssign = async (category: string) => {
    if (!category || selectedWineIds.length === 0) return
    try {
      await Promise.all(selectedWineIds.map((id) => axiosClient.patch(`/wines/${id}`, { category })))
      setSelectedWineIds([])
      await fetchWines()
    } catch (err) {
      console.error('Assign category error', err)
    }
  }

  const handleCreateAndAssign = async () => {
    const category = newCategory.trim()
    if (!category || selectedWineIds.length === 0) return
    try {
      await Promise.all(selectedWineIds.map((id) => axiosClient.patch(`/wines/${id}`, { category })))
      setNewCategory('')
      setSelectedWineIds([])
      await fetchWines()
    } catch (err) {
      console.error('Create & assign error', err)
    }
  }

  const handleRename = async (oldName: string) => {
    const newName = editValue.trim()
    if (!newName) return
    if (!confirm(`Rename category "${oldName}" to "${newName}" for all ${wines.filter((w) => (w.category ?? '').trim() === oldName).length} wines?`)) return
    try {
      const affected = wines.filter((w) => (w.category ?? '').trim() === oldName)
      await Promise.all(affected.map((w) => axiosClient.patch(`/wines/${w.id}`, { category: newName })))
      setEditingCategory(null)
      setEditValue('')
      await fetchWines()
    } catch (err) {
      console.error('Rename category error', err)
    }
  }

  const handleDelete = async (category: string) => {
    if (!confirm(`Delete category "${category}" and unset it from all related wines?`)) return
    try {
      const affected = wines.filter((w) => (w.category ?? '').trim() === category)
      await Promise.all(affected.map((w) => axiosClient.patch(`/wines/${w.id}`, { category: '' })))
      await fetchWines()
    } catch (err) {
      console.error('Delete category error', err)
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
