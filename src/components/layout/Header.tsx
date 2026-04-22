import { Link, NavLink } from 'react-router-dom'

import logo from '../../assets/img-logo.png'
import { useAuth } from '../../store/AuthContext'

const navLinkNormalStyle = (isActive: boolean) => ({
    color: isActive ? '#c29f62' : '#000000',
    fontWeight: isActive ? 'bold' : 'normal',
})

const navLinkMainStyle = (isActive: boolean) => ({
    color: isActive ? '#c29f62' : '#ffffff',
    fontWeight: isActive ? 'bold' : 'normal',
})

const guestTopNavItems = [
  { to: '/login', label: 'Đăng nhập' },
  { to: '/register', label: 'Đăng kí' },
]

const mainNavItems = [
  { to: '/', label: 'TRANG CHỦ', end: true },
  { to: '/wines/red-wine', label: 'RƯỢU VANG ĐỎ' },
  { to: '/wines/white-wine', label: 'RƯỢU VANG TRẮNG' },
  { to: '/wines/champagne', label: 'CHAMPAGNE' },
  { to: '/wines/others', label: 'LOẠI RƯỢU KHÁC' },
  { to: '/blog', label: 'BLOG' },
  { to: '/contact', label: 'LIÊN HỆ' },
]

export default function Header({ className = '' }) {
  const { user, logout } = useAuth()

  const topNavItems = user
    ? [
        { to: '/', label: `Xin chào, ${user.firstName}`, end: true },
        { to: '/order', label: 'Trạng thái đơn hàng' },
        { to: '/favorites', label: 'Danh sách ưu thích' },
        { to: '/cart', label: 'Giỏ hàng' },
      ]
    : guestTopNavItems

  return (
    <>
    <header className={`flex items-center justify-between px-6 py-4 ${className}`}>
      <nav>
        <ul className="flex flex-wrap gap-4 text-sm">
          {topNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                end={item.end}
                to={item.to}
                style={({ isActive }) => navLinkNormalStyle(isActive)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {user ? (
        <button
          type="button"
          onClick={logout}
          className="text-sm text-black transition hover:text-[#c29f62]"
        >
          Đăng xuất
        </button>
      ) : null}
    </header>

     <header className={`flex items-center bg-black px-6 py-4 ${className}`}>
      <nav>
        <ul className="flex flex-wrap items-center gap-8 text-lg">
            <li>
              <Link to="/">
                <img src={logo} alt="logo" className="w-36 h-36 object-cover" />
              </Link>
            </li>
          {mainNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                end={item.end}
                to={item.to}
                style={({ isActive }) => navLinkMainStyle(isActive)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          
        </ul>
      </nav>
    </header>
   </>
  )
}
