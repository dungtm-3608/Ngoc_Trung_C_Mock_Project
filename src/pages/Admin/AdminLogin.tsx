import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AuthPageLayout from '../../components/layout/auth/AuthPageLayout'
import Button from '../../components/common/Button'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../constants'

type FormState = {
  username: string
  password: string
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.username === ADMIN_USERNAME && form.password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true')
      navigate('/admin/users')
      return
    }

    setError('Invalid admin credentials')
  }

  return (
    <AuthPageLayout title="Admin Login" breadcrumbLabel="Admin" asideActionLabel="" asideActionTo="/">
      <div className="max-w-2xl">
        <h2 className="font-serif text-2xl uppercase text-neutral-700">Administrator</h2>

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
          <label className="grid gap-2 text-sm text-neutral-700">
            <span>Username</span>
            <input
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm((c) => ({ ...c, username: e.target.value }))}
              className="w-full border border-neutral-200 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#c29f62]"
              placeholder="admin"
            />
          </label>

          <label className="grid gap-2 text-sm text-neutral-700">
            <span>Password</span>
            <input
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
              className="w-full border border-neutral-200 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#c29f62]"
              placeholder="password"
              type="password"
            />
          </label>

          {error ? <p className="m-0 text-sm text-red-600">{error}</p> : null}

          <div>
            <Button type="submit">Sign in</Button>
          </div>
        </form>
      </div>
    </AuthPageLayout>
  )
}
