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
  const [submitted, setSubmitted] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Record<keyof LoginFormState, boolean>>({
    email: false,
    password: false,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fieldErrors = {
    email: validateEmail(form.email),
    password: validateRequired(form.password, 'Mật khẩu'),
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitted(true)

    const emailError = fieldErrors.email
    const passwordError = fieldErrors.password

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

  const showEmailError = submitted || touchedFields.email
  const showPasswordError = submitted || touchedFields.password

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
              id="login-email"
              className="w-full border border-neutral-200 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#c29f62]"
              type="email"
              value={form.email}
              onBlur={() => setTouchedFields((current) => ({ ...current, email: true }))}
              onChange={(event) => {
                setForm((current) => ({ ...current, email: event.target.value }))
                setErrorMessage('')
              }}
              placeholder="email@example.com"
              aria-invalid={showEmailError && Boolean(fieldErrors.email)}
              aria-describedby={showEmailError && fieldErrors.email ? 'login-email-error' : undefined}
            />
            {showEmailError && fieldErrors.email ? (
              <span id="login-email-error" className="text-xs text-red-600">{fieldErrors.email}</span>
            ) : null}
          </label>

          <label className="grid gap-2 text-sm text-neutral-700">
            <span>Password *</span>
            <input
              id="login-password"
              className="w-full border border-neutral-200 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#c29f62]"
              type="password"
              value={form.password}
              onBlur={() => setTouchedFields((current) => ({ ...current, password: true }))}
              onChange={(event) => {
                setForm((current) => ({ ...current, password: event.target.value }))
                setErrorMessage('')
              }}
              placeholder="Nhập mật khẩu"
              aria-invalid={showPasswordError && Boolean(fieldErrors.password)}
              aria-describedby={showPasswordError && fieldErrors.password ? 'login-password-error' : undefined}
            />
            {showPasswordError && fieldErrors.password ? (
              <span id="login-password-error" className="text-xs text-red-600">{fieldErrors.password}</span>
            ) : null}
          </label>

          <div className="text-sm text-neutral-500">
            Tài khoản mẫu: {DEMO_EMAIL} / {DEMO_PASSWORD}
          </div>

          {errorMessage ? <p className="m-0 text-sm text-red-600" role="alert" aria-live="polite">{errorMessage}</p> : null}

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
