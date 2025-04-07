import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
function UserProfile() {
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    username: '',
    email: '',
    password: '',
    avatarUrl: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user data after login (using /auth/me)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token:", token); // kiểm tra có bị null không
        const res = await fetch('http://localhost:3000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!token) {
          setError('Token không tồn tại');
          return;
        }
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || 'Không thể lấy dữ liệu người dùng');
          return;
        }
        const data = await res.json();
        setUser(data.data);
        setUpdatedUser({
          username: data.data.username,
          email: data.data.email,
          password: '',
          avatarUrl: data.data.avatarUrl
        });
      } catch (err) {
        setError('Lỗi kết nối server: ' + err.message);
      }
    };
  
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', updatedUser.username);
      formData.append('email', updatedUser.email);
      formData.append('password', updatedUser.password);
  
      // Lấy file từ input type="file"
      const avatarInput = document.getElementById("avatar");
      if (avatarInput && avatarInput.files.length > 0) {
        formData.append('avatar', avatarInput.files[0]); // tên field phải khớp backend
      }
  
      const token = localStorage.getItem('token');
      const userId = user._id;
  
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Không thêm Content-Type khi dùng FormData!
        },
        body: formData
      });
  
      const data = await res.json();
      if (res.ok) {
        if (updatedUser.password && updatedUser.password.trim() !== '') {
          alert('Cập nhật mật khẩu thành công. Vui lòng đăng nhập lại!');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setUser(data.data);
          alert('Cập nhật thông tin thành công');
        }
      } else {
        setError(data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật thông tin');
    }
  };
  
  

  return (
    <div><Header />
    <div className="container mt-5">
      <h2 className="text-center">Thông Tin Người Dùng</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {user && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={updatedUser.username} // Sửa lỗi chính tả ở đây
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={updatedUser.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={updatedUser.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
                <label htmlFor="avatar">Ảnh đại diện</label>
                <input
                    type="file"
                    className="form-control"
                    id="avatar"
                    name="avatar"
                    onChange={handleChange}
                />
                {/* Kiểm tra nếu có avatarUrl và không phải chuỗi rỗng */}
                {user.avatarUrl && user.avatarUrl.trim() !== "" ? (
                    <img src={user.avatarUrl} alt="Avatar" className="mt-2" width="100" />
                ) : (
                    <span className="mt-2">Chưa có hình</span> // Thông báo "Chưa có hình"
                )}
            </div>

          <button type="submit" className="btn btn-primary mt-3">Cập nhật</button>
        </form>
      )}
    </div>
    </div>
  );
}

export default UserProfile;
