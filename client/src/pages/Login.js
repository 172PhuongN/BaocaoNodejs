import React, { useState } from 'react';
import Header from './Header'; 
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token); // Lưu token để dùng sau
        alert("Đăng nhập thành công!");
        setTimeout(() => {
          navigate('/home');  // Điều hướng đến trang đăng nhập
        }, 2000);
      } else {
        setError(data.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError("Lỗi kết nối server.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center">Đăng Nhập</h2>
        <form onSubmit={handleSubmit} className="col-md-6 offset-md-3">
          <div className="form-group">
            <label htmlFor="username">Tên người dùng</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên người dùng"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Đăng Nhập</button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
