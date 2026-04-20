import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../store/AuthContext'

type LoginFormState = {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState<LoginFormState>({
    email: 'user@example.com',
    password: 'password',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login(form)
      navigate('/')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-6 py-8">
      <section className="w-full max-w-[440px] rounded-3xl border border-slate-300/70 bg-white/90 p-8 shadow-[0_28px_70px_rgba(15,23,42,0.16)] backdrop-blur-[14px]">
        <div className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
            Demo auth flow
          </p>
          <h1 className="m-0 text-[32px] leading-[1.1] text-slate-900">Sign in</h1>
          <p className="mt-2.5 leading-[1.6] text-slate-600">
            Use the seeded demo account to enter the application shell.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>Email</span>
            <input
              className="w-full rounded-[14px] border border-slate-300 bg-white px-3.5 py-3 text-slate-900 transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/15"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="user@example.com"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>Password</span>
            <input
              className="w-full rounded-[14px] border border-slate-300 bg-white px-3.5 py-3 text-slate-900 transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/15"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="password"
              required
            />
          </label>

          {errorMessage ? <p className="m-0 text-sm text-red-600">{errorMessage}</p> : null}

          <button
            className="cursor-pointer rounded-[14px] bg-[linear-gradient(135deg,#2563eb_0%,#0f172a_100%)] px-[18px] py-[14px] font-bold text-white transition disabled:cursor-wait disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-[18px] text-sm text-slate-500">
          Demo credentials: user@example.com / password
        </p>
      </section>
    </main>
  )
}
