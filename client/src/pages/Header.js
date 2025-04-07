import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu token tồn tại trong localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Xóa token khỏi localStorage khi người dùng đăng xuất
    localStorage.removeItem('token');
    setIsLoggedIn(false);  // Cập nhật trạng thái đăng nhập
  };

  return (
    <header>
      <nav className="navbar">
        <ul className="nav-left">
          <li>
            <Link to="/home">Trang Chủ</Link>
          </li>
        </ul>
        <ul className="nav-right">
          <li>
            <Link to="/Cart">Giỏ hàng</Link>
          </li>
          
          {/* Kiểm tra trạng thái đăng nhập */}
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login">Đăng Nhập</Link>
              </li>
              <li>
                <Link to="/register">Đăng Ký</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/UserProfile">Thông tin của bạn</Link>
              </li>
              <li>
              <Link to="/CategoriesManager">Danh mục</Link>
              </li>
              <li>
                <Link to="/ProductManager">Sản phẩm</Link>
              </li>
              <li>
                <Link to="/UserManager">Người Dùng</Link>
              </li>
              <li>
                <Link to="/RoleManager">QL Người Dùng</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Đăng Xuất</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
