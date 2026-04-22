export function isEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value)
}

export function validateUsername(value: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    return 'Tên người dùng không được để trống.'
  }

  if (normalizedValue.length < 3) {
    return 'Tên người dùng phải có ít nhất 3 ký tự.'
  }

  if (normalizedValue.length > 24) {
    return 'Tên người dùng không được vượt quá 24 ký tự.'
  }

  if (!/^[a-zA-Z0-9._]+$/.test(normalizedValue)) {
    return 'Tên người dùng chỉ được chứa chữ cái, số, dấu chấm hoặc gạch dưới.'
  }

  return ''
}

export function validateEmail(value: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    return 'Email không được để trống.'
  }

  if (!isEmail(normalizedValue)) {
    return 'Email không đúng định dạng.'
  }

  return ''
}

export function validatePassword(value: string) {
  if (!value) {
    return 'Mật khẩu không được để trống.'
  }

  if (value.length < 8) {
    return 'Mật khẩu phải có ít nhất 8 ký tự.'
  }

  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Mật khẩu phải bao gồm cả chữ và số.'
  }

  return ''
}

export function validateRequired(value: string, label: string) {
  if (!value.trim()) {
    return `${label} không được để trống.`
  }

  return ''
}
