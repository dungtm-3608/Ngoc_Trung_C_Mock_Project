import { useEffect, useState } from 'react'
import axiosClient from '../services/axiosClient'
import * as userService from '../services/userService'
import type { AuthUserRecord } from '../types'

type EditingState = Record<string, boolean>

type PaginatedUsersResponse = {
  data?: AuthUserRecord[]
  items?: number
  pages?: number
}

export default function useAdminUsers() {
  const [users, setUsers] = useState<AuthUserRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<EditingState>({})
  const [formState, setFormState] = useState<Record<string, Partial<AuthUserRecord>>>({})
  const [page, setPage] = useState<number>(1)
  const perPage = 20
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => { fetchUsers(page) }, [page])

  const fetchUsers = async (p = 1) => {
    setLoading(true)
    try {
      const res = await axiosClient.get('/users', { params: { _page: p, _per_page: perPage } })
      const payload = res.data as AuthUserRecord[] | PaginatedUsersResponse
      const nextUsers = Array.isArray(payload) ? payload : (payload.data ?? [])
      const totalCount = Array.isArray(payload) ? payload.length : (payload.items ?? nextUsers.length)
      const nextTotalPages = Array.isArray(payload) ? Math.max(1, Math.ceil(totalCount / perPage)) : (payload.pages ?? Math.max(1, Math.ceil(totalCount / perPage)))

      setUsers(nextUsers)
      setTotalPages(nextTotalPages)
    } catch (err) {
      // ignore for now
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string | number) => {
    const key = String(id)
    setEditing((s) => ({ ...s, [key]: true }))
    const user = users.find((u) => u.id === id)
    if (user) setFormState((s) => ({ ...s, [key]: { ...user } }))
  }

  const handleCancel = (id: string | number) => {
    const key = String(id)
    setEditing((s) => ({ ...s, [key]: false }))
    setFormState((s) => {
      const copy = { ...s }
      delete copy[key]
      return copy
    })
  }

  const handleSave = async (id: string | number) => {
    const key = String(id)
    const payload = formState[key]
    if (!payload) return
    try {
      const user = users.find((u) => u.id === id)
      if (payload.shippingAddresses && payload.shippingAddresses.length > 0) {
        const newAddrValue = payload.shippingAddresses[0].shippingAddress ?? ''
        if (user && user.shippingAddresses && user.shippingAddresses.length > 0) {
          const existing = user.shippingAddresses.find((a) => a.isDefault) || user.shippingAddresses[0]
          const updated = {
            ...existing,
            shippingAddress: newAddrValue,
            isDefault: true,
          }
          payload.shippingAddresses = user.shippingAddresses.map((a) => (a.id === updated.id ? updated : a))
        } else {
          const addrId = payload.shippingAddresses[0].id || `addr-${id}-${Date.now()}`
          const addr = {
            id: addrId,
            userId: String(id),
            label: payload.shippingAddresses[0].label || 'Default',
            customerName: user ? `${user.firstName} ${user.lastName}`.trim() : (payload.shippingAddresses[0].customerName || ''),
            phoneNumber: user ? user.phoneNumber : (payload.shippingAddresses[0].phoneNumber || ''),
            shippingAddress: newAddrValue,
            isDefault: true,
          }
          payload.shippingAddresses = [addr]
        }
      }

      await userService.updateUser(String(id), payload)
      await fetchUsers()
      setEditing((s) => ({ ...s, [key]: false }))
      setFormState((s) => {
        const copy = { ...s }
        delete copy[key]
        return copy
      })
    } catch (err) {
      // ignore
    }
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this user?')) return
    try {
      await userService.deleteUser(String(id))
      setUsers((u) => u.filter((item) => item.id !== id))
    } catch (err) {
      // ignore
    }
  }

  const validateEmail = (email?: string) => {
    if (!email) return false
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone?: string) => {
    if (!phone) return false
    const digits = phone.replace(/\D/g, '')
    return digits.length >= 9 && digits.length <= 11
  }

  const validateAddress = (addr?: string) => {
    if (!addr) return false
    return addr.trim().length >= 5
  }

  const isFormValid = (id: string) => {
    const fs = formState[id]
    if (!fs) return false
    if (!validateEmail(fs.email)) return false
    if (!validatePhone(fs.phoneNumber)) return false
    const addr = fs.shippingAddresses?.find((a) => a.isDefault) ?? fs.shippingAddresses?.[0]
    if (addr) {
      if (!validateAddress(addr.shippingAddress)) return false
    }
    return true
  }

  return {
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
    fetchUsers,
    page,
    setPage,
    perPage,
    totalPages,
  }
}
