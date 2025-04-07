// src/pages/AdminPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Dùng để điều hướng đến các trang khác
import axios from 'axios';

function AdminPage() {
  const navigate = useNavigate(); // Hook điều hướng

  // Kiểm tra quyền admin khi trang AdminPage được mở
  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    if (!token) {
      navigate('/login');  // Nếu không có token, chuyển hướng đến trang đăng nhập
      return;
    }

    // Kiểm tra quyền admin trong token (ví dụ: trong JWT)
    const verifyAdmin = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/check-role', {
          headers: { Authorization: token }
        });

        if (response.data.role !== 'admin') {
          navigate('/login');  // Nếu không phải admin, chuyển về trang đăng nhập
        }
      } catch (error) {
        console.error('Không có quyền truy cập:', error);
        navigate('/login');  // Nếu có lỗi, chuyển về trang đăng nhập
      }
    };

    verifyAdmin();
  }, [navigate]);

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Chào mừng bạn đến với trang quản lý dành cho admin.</p>
      {/* Các phần tử dành cho admin có thể quản lý ở đây */}
    </div>
  );
}

export default AdminPage;
