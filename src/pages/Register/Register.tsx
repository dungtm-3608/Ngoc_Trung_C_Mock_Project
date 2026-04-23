import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import FormField from '../../components/common/FormField.tsx'
import AuthPageLayout from '../../components/layout/auth/AuthPageLayout'
import { useAuth } from '../../store/AuthContext'
import type { AuthResponse } from '../../types'
import {RegisterFormState} from '../../types/register/registerFormState.ts'
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateUsername,
} from '../../utils/validators'

type RegisterFieldErrors = Record<keyof Omit<RegisterFormState, 'subscribeNewsletter'>, string>
type RegisterTouchedFields = Record<keyof RegisterFieldErrors, boolean>

const initialForm: RegisterFormState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  subscribeNewsletter: false,
}

const initialTouchedFields: RegisterTouchedFields = {
  firstName: false,
  lastName: false,
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
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

function getInputValue(event: ChangeEvent<HTMLInputElement>) {
  return event.target.value
}

export default function Register() {
  const navigate = useNavigate()
  const { register, persistAuth } = useAuth()
  const [form, setForm] = useState<RegisterFormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [touchedFields, setTouchedFields] = useState<RegisterTouchedFields>(initialTouchedFields)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [pendingAuth, setPendingAuth] = useState<AuthResponse | null>(null)

  const fieldErrors = useMemo(() => getFieldErrors(form), [form])

  const hasErrors = useMemo(
    () => Object.values(fieldErrors).some(Boolean),
    [fieldErrors],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    setErrorMessage('')

    if (hasErrors) {
      return
    }

    setIsSubmitting(true)

    try {
      const authResponse = await register(form)
      setPendingAuth(authResponse)
      setIsSuccessDialogOpen(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đăng ký thất bại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessDialog = () => {
    if (pendingAuth) {
      persistAuth(pendingAuth)
    }

    setPendingAuth(null)
    setIsSuccessDialogOpen(false)
    navigate('/')
  }

  const handleChange = <K extends keyof RegisterFormState>(field: K, value: RegisterFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrorMessage('')

    if (field === 'subscribeNewsletter') {
      return
    }
  }

  const shouldShowFieldError = (field: keyof RegisterFieldErrors) => submitted || touchedFields[field]

  return (
    <AuthPageLayout
      title="Đăng ký"
      breadcrumbLabel="Đăng ký"
      asideActionLabel="Đăng nhập"
      asideActionTo="/login"
    >
      {isSuccessDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-success-title"
            aria-describedby="register-success-description"
            className="w-full max-w-md border border-neutral-200 bg-white p-8 text-center shadow-2xl"
          >
            <h2 id="register-success-title" className="font-serif text-3xl uppercase text-neutral-800">
              Thành công
            </h2>
            <p id="register-success-description" className="mt-4 text-sm leading-6 text-neutral-600">
              Tạo tài khoản thành công. Hãy bắt đầu thôi !
            </p>
            <button
              type="button"
              onClick={handleCloseSuccessDialog}
              className="mt-8 border border-black bg-black px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-[#c29f62] hover:bg-[#c29f62]"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}

      <form className="grid gap-10" onSubmit={handleSubmit} noValidate>
        <section>
          <h2 className="font-serif text-2xl uppercase text-neutral-700">Thông tin cá nhân</h2>

          <div className="mt-6 grid gap-5">
            <FormField
              label="Tên trước *"
              error={fieldErrors.firstName}
              errorId="register-first-name-error"
              isErrorVisible={shouldShowFieldError('firstName')}
              inputProps={{
                id: 'register-first-name',
                className: inputClassName,
                type: 'text',
                value: form.firstName,
                onBlur: () => setTouchedFields((current) => ({ ...current, firstName: true })),
                onChange: (event) => handleChange('firstName', getInputValue(event)),
              }}
            />

            <FormField
              label="Tên sau *"
              error={fieldErrors.lastName}
              errorId="register-last-name-error"
              isErrorVisible={shouldShowFieldError('lastName')}
              inputProps={{
                id: 'register-last-name',
                className: inputClassName,
                type: 'text',
                value: form.lastName,
                onBlur: () => setTouchedFields((current) => ({ ...current, lastName: true })),
                onChange: (event) => handleChange('lastName', getInputValue(event)),
              }}
            />

            <FormField
              label="Tên người dùng *"
              error={fieldErrors.username}
              errorId="register-username-error"
              isErrorVisible={shouldShowFieldError('username')}
              inputProps={{
                id: 'register-username',
                className: inputClassName,
                type: 'text',
                value: form.username,
                onBlur: () => setTouchedFields((current) => ({ ...current, username: true })),
                onChange: (event) => handleChange('username', getInputValue(event)),
              }}
            />

            <FormField
              label="Email *"
              error={fieldErrors.email}
              errorId="register-email-error"
              isErrorVisible={shouldShowFieldError('email')}
              inputProps={{
                id: 'register-email',
                className: inputClassName,
                type: 'email',
                value: form.email,
                onBlur: () => setTouchedFields((current) => ({ ...current, email: true })),
                onChange: (event) => handleChange('email', getInputValue(event)),
              }}
            />

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
            <FormField
              label="Mật khẩu *"
              error={fieldErrors.password}
              errorId="register-password-error"
              isErrorVisible={shouldShowFieldError('password')}
              inputProps={{
                id: 'register-password',
                className: inputClassName,
                type: 'password',
                value: form.password,
                onBlur: () => setTouchedFields((current) => ({ ...current, password: true })),
                onChange: (event) => handleChange('password', getInputValue(event)),
              }}
            />

            <FormField
              label="Xác nhận mật khẩu *"
              error={fieldErrors.confirmPassword}
              errorId="register-confirm-password-error"
              isErrorVisible={shouldShowFieldError('confirmPassword')}
              inputProps={{
                id: 'register-confirm-password',
                className: inputClassName,
                type: 'password',
                value: form.confirmPassword,
                onBlur: () => setTouchedFields((current) => ({ ...current, confirmPassword: true })),
                onChange: (event) => handleChange('confirmPassword', getInputValue(event)),
              }}
            />
          </div>
        </section>

        {errorMessage ? <p className="text-sm text-red-600" role="alert" aria-live="polite">{errorMessage}</p> : null}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
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