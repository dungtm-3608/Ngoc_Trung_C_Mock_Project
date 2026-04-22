import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AuthPageLayout from '../../components/layout/auth/AuthPageLayout'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../../constants'
import { useAuth } from '../../store/AuthContext'
import { validateEmail, validateRequired } from '../../utils/validators'

type LoginFormState = {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState<LoginFormState>({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const emailError = validateEmail(form.email)
    const passwordError = validateRequired(form.password, 'Mật khẩu')

    if (emailError || passwordError) {
      setErrorMessage(emailError || passwordError)
      return
    }

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
    <AuthPageLayout
      title="Đăng nhập"
      breadcrumbLabel="Đăng nhập"
      asideActionLabel="Đăng ký"
      asideActionTo="/register"
    >
      <div className="max-w-4xl">
        <h2 className="font-serif text-2xl uppercase text-neutral-700">Khách hàng đăng nhập</h2>
        <p className="mt-4 text-sm text-neutral-500">
          Nếu bạn có một tài khoản, xin vui lòng đăng nhập.
        </p>

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
          <label className="grid gap-2 text-sm text-neutral-700">
            <span>Email *</span>
            <input
              className="w-full border border-neutral-200 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#c29f62]"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="email@example.com"
            />
          </label>

          <label className="grid gap-2 text-sm text-neutral-700">
            <span>Password *</span>
            <input
              className="w-full border border-neutral-200 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#c29f62]"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Nhập mật khẩu"
            />
          </label>

          <div className="text-sm text-neutral-500">
            Tài khoản mẫu: {DEMO_EMAIL} / {DEMO_PASSWORD}
          </div>

          {errorMessage ? <p className="m-0 text-sm text-red-600">{errorMessage}</p> : null}

          <div>
            <button
              className="border border-black bg-black px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-[#c29f62] hover:bg-[#c29f62] disabled:cursor-wait disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Đang đăng nhập' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </AuthPageLayout>
  )
}
