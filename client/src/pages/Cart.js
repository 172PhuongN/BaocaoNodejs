import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function OrderDetails() {
  const { orderId } = useParams(); // Lấy ID đơn hàng từ URL
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:3000/orders/${orderId}`);
        const data = await response.json();
        if (response.ok) {
          setOrder(data);
        } else {
          setError(data.message || 'Không tìm thấy đơn hàng');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="container mt-5">
      <h2>Chi Tiết Đơn Hàng</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {order ? (
        <div>
          <h3>ID Đơn Hàng: {order._id}</h3>
          <p><strong>Tổng Tiền:</strong> {order.totalAmount} VND</p>
          <p><strong>Trạng Thái:</strong> {order.status}</p>
          <h4>Sản Phẩm:</h4>
          <ul>
            {order.products.map((product, index) => (
              <li key={index}>
                <strong>Sản phẩm {index + 1}:</strong>
                <p>ID Sản phẩm: {product.productId}</p>
                <p>Số lượng: {product.quantity}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Đang tải thông tin đơn hàng...</p>
      )}
    </div>
  );
}

export default OrderDetails;
