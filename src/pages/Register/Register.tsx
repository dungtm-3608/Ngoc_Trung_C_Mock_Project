import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AuthPageLayout from '../../components/layout/auth/AuthPageLayout'
import { useAuth } from '../../store/AuthContext'
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateUsername,
} from '../../utils/validators'

type RegisterFormState = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  subscribeNewsletter: boolean
}

type RegisterFieldErrors = Record<keyof Omit<RegisterFormState, 'subscribeNewsletter'>, string>

const initialForm: RegisterFormState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  subscribeNewsletter: false,
}

const initialErrors: RegisterFieldErrors = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const inputClassName =
  'w-full border border-neutral-200 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-[#c29f62]'

function getFieldErrors(form: RegisterFormState): RegisterFieldErrors {
  return {
    firstName: validateRequired(form.firstName, 'Tên trước'),
    lastName: validateRequired(form.lastName, 'Tên sau'),
    username: validateUsername(form.username),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirmPassword: !form.confirmPassword
      ? 'Xác nhận mật khẩu không được để trống.'
      : form.confirmPassword !== form.password
        ? 'Mật khẩu xác nhận không khớp.'
        : '',
  }
}

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState<RegisterFormState>(initialForm)
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>(initialErrors)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasErrors = useMemo(
    () => Object.values(fieldErrors).some(Boolean),
    [fieldErrors],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = getFieldErrors(form)

    setFieldErrors(nextErrors)
    setErrorMessage('')

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    setIsSubmitting(true)

    try {
      await register(form)
      navigate('/')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đăng ký thất bại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = <K extends keyof RegisterFormState>(field: K, value: RegisterFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }))

    if (field === 'subscribeNewsletter') {
      return
    }

    const nextForm = { ...form, [field]: value }
    setFieldErrors(getFieldErrors(nextForm))
  }

  return (
    <AuthPageLayout
      title="Đăng ký"
      breadcrumbLabel="Đăng ký"
      asideActionLabel="Đăng nhập"
      asideActionTo="/login"
    >
      <form className="grid gap-10" onSubmit={handleSubmit} noValidate>
        <section>
          <h2 className="font-serif text-2xl uppercase text-neutral-700">Thông tin cá nhân</h2>

          <div className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm text-neutral-700">
              <span>Tên trước *</span>
              <input
                className={inputClassName}
                type="text"
                value={form.firstName}
                onChange={(event) => handleChange('firstName', event.target.value)}
              />
              {fieldErrors.firstName ? <span className="text-xs text-red-600">{fieldErrors.firstName}</span> : null}
            </label>

            <label className="grid gap-2 text-sm text-neutral-700">
              <span>Tên sau *</span>
              <input
                className={inputClassName}
                type="text"
                value={form.lastName}
                onChange={(event) => handleChange('lastName', event.target.value)}
              />
              {fieldErrors.lastName ? <span className="text-xs text-red-600">{fieldErrors.lastName}</span> : null}
            </label>

            <label className="grid gap-2 text-sm text-neutral-700">
              <span>Tên người dùng *</span>
              <input
                className={inputClassName}
                type="text"
                value={form.username}
                onChange={(event) => handleChange('username', event.target.value)}
              />
              {fieldErrors.username ? <span className="text-xs text-red-600">{fieldErrors.username}</span> : null}
            </label>

            <label className="grid gap-2 text-sm text-neutral-700">
              <span>Email *</span>
              <input
                className={inputClassName}
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
              />
              {fieldErrors.email ? <span className="text-xs text-red-600">{fieldErrors.email}</span> : null}
            </label>

            <label className="flex items-center gap-3 text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={form.subscribeNewsletter}
                onChange={(event) => handleChange('subscribeNewsletter', event.target.checked)}
              />
              <span>Đăng ký nhận bản tin</span>
            </label>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl uppercase text-neutral-700">Thông tin đăng nhập</h2>

          <div className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm text-neutral-700">
              <span>Mật khẩu *</span>
              <input
                className={inputClassName}
                type="password"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
              />
              {fieldErrors.password ? <span className="text-xs text-red-600">{fieldErrors.password}</span> : null}
            </label>

            <label className="grid gap-2 text-sm text-neutral-700">
              <span>Xác nhận mật khẩu *</span>
              <input
                className={inputClassName}
                type="password"
                value={form.confirmPassword}
                onChange={(event) => handleChange('confirmPassword', event.target.value)}
              />
              {fieldErrors.confirmPassword ? <span className="text-xs text-red-600">{fieldErrors.confirmPassword}</span> : null}
            </label>
          </div>
        </section>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting || hasErrors}
            className="border border-black bg-black px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-[#c29f62] hover:bg-[#c29f62] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Đang gửi' : 'Gửi'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-black bg-black px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-[#c29f62] hover:bg-[#c29f62]"
          >
            Quay lại
          </button>
        </div>
      </form>
    </AuthPageLayout>
  )
}