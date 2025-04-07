import React, { useState, useEffect } from 'react';
import Header from './Header'; 
import './Home.css';
import { jwtDecode } from 'jwt-decode';

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/products');
        if (!res.ok) throw new Error('Không thể lấy dữ liệu sản phẩm');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError('Lỗi kết nối server: ' + err.message);
      }
    };

    fetchProducts();
  }, []);

  const handleOrder = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Bạn cần đăng nhập để đặt hàng.');

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const product = products.find(p => p._id === productId);
      if (!product) throw new Error('Sản phẩm không tồn tại');

      const orderData = {
        userId,
        products: [{ productId: product._id, quantity: 1 }],
        totalAmount: product.price,
      };

      const res = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error(`Không thể tạo đơn hàng. Lỗi: ${await res.text()}`);

      alert('Đơn hàng đã được tạo thành công!');
    } catch (err) {
      setError('Lỗi khi tạo đơn hàng: ' + err.message);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Bạn cần đăng nhập để thêm sản phẩm yêu thích.');

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const res = await fetch('http://localhost:3000/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!res.ok) throw new Error('Không thể thêm sản phẩm vào danh sách yêu thích.');

      alert('Đã thêm vào danh sách yêu thích!');
    } catch (err) {
      setError('Lỗi yêu thích: ' + err.message);
    }
  };

  return (
    <div>
      <Header />
      <h1 className="text-center my-4">Danh Sách Sản Phẩm</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="container">
        <div className="row justify-content-center">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="col-md-3 mb-4">
                <div className="product-item text-center border p-3">
                  <img src={product.imgURL} alt={product.productName} className="img-fluid mb-2" />
                  <h3>{product.productName}</h3>
                  <p>Giá: {product.price} VND</p>
                  <p>{product.description}</p>
                  <button 
                    className="btn btn-primary mt-2" 
                    onClick={() => handleOrder(product._id)}
                  >
                    Đặt Hàng
                  </button>
                  <button 
                    className="btn btn-outline-danger mt-2 ms-2" 
                    onClick={() => handleAddToWishlist(product._id)}
                  >
                    ❤️ Yêu Thích
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
