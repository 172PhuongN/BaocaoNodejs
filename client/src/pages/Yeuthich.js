import React, { useEffect, useState } from 'react';
import Header from './Header';
import { jwtDecode } from 'jwt-decode';

function Yeuthich() {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Bạn chưa đăng nhập.');

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await fetch(`http://localhost:3000/wishlist/${userId}`);
        if (!res.ok) throw new Error('Không thể tải danh sách yêu thích.');

        const data = await res.json();
        setWishlist(data.products || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const res = await fetch(`http://localhost:3000/wishlist/${userId}/${productId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Không thể xóa sản phẩm.');

      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Header />
      <h1 className="text-center my-4">💖 Danh Sách Yêu Thích</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="container">
        <div className="row justify-content-center">
          {wishlist.length > 0 ? (
            wishlist.map(product => (
              <div key={product._id} className="col-md-3 mb-4">
                <div className="product-item text-center border p-3">
                  <img src={product.imgURL} alt={product.productName} className="img-fluid mb-2" />
                  <h3>{product.productName}</h3>
                  <p>Giá: {product.price} VND</p>
                  <p>{product.description}</p>
                  <button 
                    className="btn btn-outline-danger mt-2"
                    onClick={() => handleRemove(product._id)}
                  >
                    ❌ Xóa
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào trong danh sách yêu thích</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Yeuthich;
