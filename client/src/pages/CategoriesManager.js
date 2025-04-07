import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header'; 

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:3000/categories/${currentCategoryId}`, {
          categoryName,
          description,
        });
        alert("Cập nhật danh mục thành công!");
      } else {
        await axios.post('http://localhost:3000/categories', {
          categoryName,
          description,
        });
        alert("Thêm danh mục thành công!");
      }
      fetchCategories();
      setCategoryName('');
      setDescription('');
      setEditMode(false);
      setCurrentCategoryId(null);
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      try {
        await axios.delete(`http://localhost:3000/categories/${id}`);
        fetchCategories();
        alert("Xóa danh mục thành công!");
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
      }
    }
  };

  const handleEdit = (category) => {
    setCategoryName(category.categoryName);
    setDescription(category.description);
    setEditMode(true);
    setCurrentCategoryId(category._id);
  };

  return (
    <div>
      <Header /> {/* Thêm Header vào đây */}  
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Quản lý Danh mục</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <label className="form-label">Tên danh mục</label>
            <input
              type="text"
              className="form-control"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              placeholder="Nhập tên danh mục"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Mô tả</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả danh mục"
            />
          </div>
          <div className="col-md-4 d-flex align-items-end justify-content-end">
            <button type="submit" className={`btn ${editMode ? 'btn-warning' : 'btn-primary'} btn-sm`}>
              {editMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </div>
      </form>

      <h4 className="mb-3">Danh sách Danh mục</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-light">
            <tr>
              <th scope="col">Tên danh mục</th>
              <th scope="col">Mô tả</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.categoryName}</td>
                <td>{category.description}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(category)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(category._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-muted">Không có danh mục nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default CategoryManager;
