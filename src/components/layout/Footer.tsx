import logo from '../../assets/img-branch.png';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <img src={logo} alt="Authentic" className="mx-auto w-full h-auto object-contain" />
        <div className="grid grid-cols-4 gap-8 mt-8 text-sm text-gray-600">
          <div>
            <h3 className="font-bold text-gray-800 mb-4 uppercase">Thông Tin</h3>
            <ul>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Về chúng tôi</li>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Giao hàng</li>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Cam kết</li>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Lưu trữ</li>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Chính sách riêng tư</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-4 uppercase">Mua Hàng</h3>
            <ul>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Vận chuyển và trả hàng</li>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Mua hàng an toàn</li>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Vận quốc tế</li>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Liên kết</li>
              <li className="hover:text-blue-500 active:text-blue-700 uppercase">Dịch vụ giảm giá</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-4 uppercase">Gửi Email</h3>
            <p>Gửi email cho chúng tôi để được hỗ trợ</p>
            <form className="mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="mt-2 w-full bg-black text-white py-2 rounded-md"
              >
                Gửi
              </button>
            </form>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-4 uppercase">Liên Hệ</h3>
            <p>Tầng 4, Tòa nhà Hanoi Group Số 442 Đội Cấn, P. Cống Vị, Q. Ba Đình, Hà Nội</p>
            <p>📞 (04) 6674 2332 - (04) 3786 8904</p>
            <p>📞 (08) 6680 9686 ✉️ support@bizweb.vn</p>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-xs">
          © Copyright 2008-2014 DKT Technology JSC
        </div>
      </div>
    </footer>
  );
}