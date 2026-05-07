import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/common/Button'

type Props = {
  children: ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r p-4">
        <div className="mb-6">
          <div className="text-sm font-semibold">Admin Console</div>
          <div className="text-xs text-neutral-500">admin@mail/company.com</div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/admin/users" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-slate-100 font-semibold' : 'text-neutral-700'}`}>
            Users
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-slate-100 font-semibold' : 'text-neutral-700'}`}>
            Categories
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-slate-100 font-semibold' : 'text-neutral-700'}`}>
            Product
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-slate-100 font-semibold' : 'text-neutral-700'}`}>
            Order
          </NavLink>
        </nav>

        <div className="mt-6">
          <Button onClick={() => { localStorage.removeItem('isAdmin'); window.location.href = '/' }} className="bg-gray-800">Sign out</Button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
