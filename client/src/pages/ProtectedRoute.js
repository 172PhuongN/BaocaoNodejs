// src/pages/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';  // Thêm dòng này để import Navigate

function ProtectedRoute({ element }) {
  const isAuthenticated = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!isAuthenticated || role !== 'admin') {
    // Nếu không phải admin, chuyển hướng đến trang login
    return <Navigate to="/login" />;
  }

  return element;  // Trả về component trang admin nếu người dùng có quyền admin
}

export default ProtectedRoute;
