import React, { useState, useEffect } from 'react';
import Header from './Header'; 
import './Home.css'; // Import CSS cho trang Home

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  // Lấy danh sách sản phẩm từ API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/products');
        if (!res.ok) {
          throw new Error('Không thể lấy dữ liệu sản phẩm');
        }
        const data = await res.json();
        setProducts(data); // Lưu trữ sản phẩm vào state
      } catch (err) {
        setError('Lỗi kết nối server: ' + err.message);
      }
    };

    fetchProducts();
  }, []); // useEffect sẽ chạy một lần khi component render

  // Hàm xử lý khi người dùng nhấn "Đặt Hàng"
  const handleOrder = async (productId) => {
    try {
      // Lấy ID người dùng từ state hoặc context, thay thế 'userId_placeholder'
      const userId = 'userId_placeholder'; // Lấy giá trị chính thức của userId ở đây
      
      // Tìm sản phẩm từ danh sách sản phẩm
      const product = products.find(p => p._id === productId);
      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }
  
      // Dữ liệu đặt hàng
      const orderData = {
        userId: userId,
        products: [{
          productId: product._id,
          quantity: 1, // Giả sử số lượng là 1
        }],
        totalAmount: product.price, // Giả sử tổng số tiền là giá sản phẩm
      };
  
      console.log('Order Data:', orderData);  // Log dữ liệu đặt hàng
  
      // Gửi yêu cầu POST tạo đơn hàng
      const res = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData), // Gửi dữ liệu JSON
      });
  
      // Kiểm tra phản hồi
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Không thể tạo đơn hàng. Lỗi: ${errorText}`);
      }
  
      const data = await res.json();
      console.log('Đơn hàng đã được tạo:', data); // Log kết quả đơn hàng
  
      // Thông báo cho người dùng
      alert('Đơn hàng đã được tạo thành công!');
    } catch (err) {
      setError('Lỗi khi tạo đơn hàng: ' + err.message);
    }
  };
  
  

  return (
    <div>
      <Header />
      <h1 className="text-center my-4">Danh Sách Sản Phẩm</h1>
    
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Hiển thị lỗi nếu có */}

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

                  {/* Nút Đặt Hàng */}
                  <button 
                    className="btn btn-primary mt-3" 
                    onClick={() => handleOrder(product._id)}
                  >
                    Đặt Hàng
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
