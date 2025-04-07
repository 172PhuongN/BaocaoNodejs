import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from './Header'; 

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');  // Thêm state cho role
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate(); // Khai báo useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }), // Thêm role vào body
        mode: 'cors'
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage("Đăng ký thành công!");
        setError('');
        
        // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
        setTimeout(() => {
          navigate('/login');  // Điều hướng đến trang đăng nhập
        }, 2000); // Chờ 2 giây để người dùng có thể đọc thông báo
      } else {
        setError(data.message || "Đăng ký thất bại.");
      }
    } catch (err) {
      setError("Lỗi kết nối server." + err.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center">Đăng Ký</h2>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
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
          <button type="submit" className="btn btn-primary btn-block">Đăng Ký</button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {message && <div className="alert alert-success mt-3">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default Register;
