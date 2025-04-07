import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header'; 
function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [categoryID, setCategoryID] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:3000/products');
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:3000/categories');
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        productName,
        price,
        quantity,
        description,
        imgURL,
        categoryID
      };

      if (editMode) {
        await axios.put(`http://localhost:3000/products/${currentProductId}`, payload);
        alert('Cập nhật sản phẩm thành công');
      } else {
        await axios.post('http://localhost:3000/products', payload);
        alert('Thêm sản phẩm thành công');
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Lỗi khi lưu sản phẩm');
    }
  };

  const handleEdit = (product) => {
    setProductName(product.productName);
    setPrice(product.price);
    setQuantity(product.quantity);
    setDescription(product.description || '');
    setImgURL(product.imgURL || '');
    setCategoryID(product.categoryID?._id || '');
    setEditMode(true);
    setCurrentProductId(product._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      await axios.delete(`http://localhost:3000/products/${id}`);
      fetchProducts();
    }
  };

  const resetForm = () => {
    setProductName('');
    setPrice(1);
    setQuantity(1);
    setDescription('');
    setImgURL('');
    setCategoryID('');
    setEditMode(false);
    setCurrentProductId(null);
  };

  return (
    
    <div>
        <Header/>
    
    <div className="container mt-5">
      <h2 className="text-center mb-4">Quản lý Sản phẩm</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Tên sản phẩm</label>
            <input className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Giá</label>
            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(Number(e.target.value))} min={0} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Số lượng</label>
            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={0} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mô tả</label>
            <input className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Ảnh URL</label>
            <input className="form-control" value={imgURL} onChange={(e) => setImgURL(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Danh mục</label>
            <select className="form-select" value={categoryID} onChange={(e) => setCategoryID(e.target.value)} required>
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 d-flex align-items-end justify-content-end">
            <button className={`btn ${editMode ? 'btn-warning' : 'btn-primary'} btn-sm`}>
              {editMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Danh mục</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.productName}</td>
                <td>{p.price.toLocaleString()}</td>
                <td>{p.quantity}</td>
                <td>{p.categoryID?.categoryName || 'Không rõ'}</td>
                <td>
                  {p.imgURL ? <img src={p.imgURL} alt="product" width={50} height={50} /> : 'Không có'}
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>
                    Sửa
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-muted">Không có sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default ProductManager;
