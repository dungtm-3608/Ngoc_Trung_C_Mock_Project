import axiosClient from './axiosClient'
import type { ShippingAddress } from '../types/shippingAddress'

type RawUser = {
  id: string
  shippingAddresses?: ShippingAddress[]
}

export async function getShippingAddressesForUser(userId: string): Promise<ShippingAddress[]> {
  const { data } = await axiosClient.get<RawUser>(`/users/${userId}`)
  return data.shippingAddresses ?? []
}

export async function getDefaultShippingAddress(userId: string): Promise<ShippingAddress | undefined> {
  const profiles = await getShippingAddressesForUser(userId)
  const found = profiles.find((p) => p.isDefault)
  if (found) return found

  const { data: user } = await axiosClient.get<RawUser>(`/users/${userId}`)
  const fallbackAddress = '12 Nguyen Hue, District 1, Ho Chi Minh City'
  const auto: ShippingAddress = {
    id: `addr-${userId}-${Date.now()}`,
    userId: userId,
    label: 'Địa chỉ mặc định',
    customerName: (user as any).firstName ? `${(user as any).firstName} ${(user as any).lastName || ''}`.trim() : '',
    phoneNumber: (user as any).phoneNumber || '',
    shippingAddress: fallbackAddress,
    isDefault: true,
  }

  const current = user.shippingAddresses ?? []
  for (const p of current) p.isDefault = false
  current.unshift(auto)
  await axiosClient.patch(`/users/${userId}`, { shippingAddresses: current })
  return auto
}

export async function saveShippingAddress(userId: string, profile: ShippingAddress): Promise<ShippingAddress> {
  const { data: user } = await axiosClient.get<RawUser>(`/users/${userId}`)
  const current = user.shippingAddresses ?? []

  const next = current.filter((p) => p.id !== profile.id)
  if (profile.isDefault) {
    for (const p of next) p.isDefault = false
  }

  next.unshift(profile)

  await axiosClient.patch(`/users/${userId}`, { shippingAddresses: next })
  return profile
}

export async function deleteShippingAddress(userId: string, profileId: string): Promise<void> {
  const { data: user } = await axiosClient.get<RawUser>(`/users/${userId}`)
  const current = user.shippingAddresses ?? []
  const next = current.filter((p) => p.id !== profileId)
  await axiosClient.patch(`/users/${userId}`, { shippingAddresses: next })
}
