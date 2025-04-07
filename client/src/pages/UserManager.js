import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from './Header';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [editUserId, setEditUserId] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editUserId) {
      await axios.put(`http://localhost:3000/users/${editUserId}`, formData);
    } else {
      await axios.post("http://localhost:3000/users", formData);
    }
    setFormData({ username: "", password: "", email: "", role: "" });
    setEditUserId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      password: "",
      email: user.email,
      role: user.role.roleName,
    });
    setEditUserId(user._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <Header />
      <div className="container py-5">
        <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-3">
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Tên đăng nhập"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Mật khẩu"
              required={!editUserId}
            />
          </div>
          <div className="col-md-3">
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
              placeholder="Vai trò"
              required
            />
          </div>
          <div className="col-md-12">
            <button type="submit" className="btn btn-primary w-100">
              {editUserId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>

        <div className="card">
          <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role?.roleName || "Không rõ"}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
