import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from './Header';

export default function RoleManager() {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
  });
  const [editRoleId, setEditRoleId] = useState(null);

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:3000/roles");
    setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editRoleId) {
      await axios.put(`http://localhost:3000/roles/${editRoleId}`, formData);
    } else {
      await axios.post("http://localhost:3000/roles", formData);
    }
    setFormData({ roleName: "", description: "" });
    setEditRoleId(null);
    fetchRoles();
  };

  const handleEdit = (role) => {
    setFormData({
      roleName: role.roleName,
      description: role.description,
    });
    setEditRoleId(role._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/roles/${id}`);
    fetchRoles();
  };

  return (
    <div>
      <Header />
      <div className="container py-5">
        <h2 className="text-2xl font-bold mb-4">Quản lý vai trò</h2>
        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-3">
            <input
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              className="form-control"
              placeholder="Tên vai trò"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Mô tả"
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100">
              {editRoleId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>

        <div className="card">
          <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Tên vai trò</th>
                  <th>Mô tả</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role._id}>
                    <td>{role.roleName}</td>
                    <td>{role.description || "Không có mô tả"}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleEdit(role)}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(role._id)}
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
