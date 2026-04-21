
import logo from '../../assets/img-logo.png';



const navLinkNormalStyle = (isActive: boolean) => ({
    color: isActive ? '#c29f62' : '#000000',
    fontWeight: isActive ? 'bold' : 'normal',
})

const navLinkMainStyle = (isActive: boolean) => ({
    color: isActive ? '#c29f62' : '#ffffff',
    fontWeight: isActive ? 'bold' : 'normal',
})



export default function Header({ className = '' }) {
  return (
    <>      
    <header className={`flex items-center bg-white-10 px-6 py-4 ${className}`}>
    
      <nav>
        <ul className="flex gap-4 text-sm">
          <li>
            <a href="/" style={navLinkNormalStyle(window.location.pathname === '/')}>
              Tài khoản của tôi 
            </a>
          </li>
          <li>
            <a href="/order" style={navLinkNormalStyle(window.location.pathname === '/order')}>
              Trạng thái đơn hàng
            </a>
          </li>
          <li>
            <a href="/favorites" style={navLinkNormalStyle(window.location.pathname === '/favorites')}>
              Danh sách ưu thích
            </a>
          </li>
          <li>
            <a href="/cart" style={navLinkNormalStyle(window.location.pathname === '/cart')}>
             Giỏ hàng
            </a>
          </li>
          <li>
            <a href="/login" style={navLinkNormalStyle(window.location.pathname === '/login')}>
              Đăng nhập
            </a>
          </li>
          <li>
            <a href="/register" style={navLinkNormalStyle(window.location.pathname === '/register')}>
              Đăng kí
            </a>
          </li>
        </ul>
      </nav>
    </header>
     <header className={`flex items-center bg-black px-6 py-4 ${className}`}>
    
      <nav>
        <ul className="flex gap-8 text-lg items-center">
            <li>
              <img src={logo} alt="logo" className="w-36 h-36 object-cover" />       
            </li>
          <li>
            <a href="/" style={navLinkMainStyle(window.location.pathname === '/')}>
              TRANG CHỦ
            </a>
          </li>
          <li>
            <a href="/red_wine" style={navLinkMainStyle(window.location.pathname === '/red_wine')}>
              RƯỢU VANG ĐỎ
            </a>
          </li>
          <li>
            <a href="/white_wine" style={navLinkMainStyle(window.location.pathname === '/white_wine')}>
             RƯỢU VANG TRẮNG
            </a>
          </li>
          <li>
            <a href="/champagne" style={navLinkMainStyle(window.location.pathname === '/champagne')}>
              CHAMPAGNE
            </a>
          </li>
          <li>
            <a href="/information" style={navLinkMainStyle(window.location.pathname === '/information')}>
              THÔNG TIN
            </a>
          </li>
           <li>
            <a href="/blog" style={navLinkMainStyle(window.location.pathname === '/blog')}>
              BLOG
            </a>
          </li>
           <li>
            <a href="/contact" style={navLinkMainStyle(window.location.pathname === '/contact')}>
              LIÊN HỆ
            </a>
          </li>
          
        </ul>
      </nav>
    </header>
   </>
    
  )
}
