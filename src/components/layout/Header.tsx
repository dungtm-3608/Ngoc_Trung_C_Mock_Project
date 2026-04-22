
import { Link, NavLink } from 'react-router-dom'

import logo from '../../assets/img-logo.png'

const navLinkNormalStyle = (isActive: boolean) => ({
    color: isActive ? '#c29f62' : '#000000',
    fontWeight: isActive ? 'bold' : 'normal',
})

const navLinkMainStyle = (isActive: boolean) => ({
    color: isActive ? '#c29f62' : '#ffffff',
    fontWeight: isActive ? 'bold' : 'normal',
})

const topNavItems = [
  { to: '/', label: 'Tài khoản của tôi', end: true },
  { to: '/order', label: 'Trạng thái đơn hàng' },
  { to: '/favorites', label: 'Danh sách ưu thích' },
  { to: '/cart', label: 'Giỏ hàng' },
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
  return (
    <>      
    <header className={`flex items-center bg-white-10 px-6 py-4 ${className}`}>
    
      <nav>
        <ul className="flex gap-4 text-sm">
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
    </header>
     <header className={`flex items-center bg-black px-6 py-4 ${className}`}>
    
      <nav>
        <ul className="flex gap-8 text-lg items-center">
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
