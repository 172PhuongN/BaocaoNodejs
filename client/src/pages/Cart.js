import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './Header';

function Cart() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Hàm lấy danh sách đơn hàng
  const fetchOrders = async (userId, token) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Không thể lấy đơn hàng.');

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn chưa đăng nhập.');
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    fetchOrders(userId, token);
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      // Xoá đơn khỏi danh sách hiện tại
      setOrders(orders.filter(order => order._id !== orderId));
      alert("Huỷ đơn hàng thành công.");
    } catch (err) {
      setError("Không thể huỷ đơn hàng: " + err.message);
    }
  };

  return (
    <div>
      <Header />
      <h2 className="text-center my-4">Giỏ Hàng / Đơn Đặt</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orders.length === 0 ? (
        <p className="text-center">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="container">
          {orders.map(order => (
            <div key={order._id} className="border p-3 my-2">
              <h5>Mã đơn: {order._id}</h5>
              <p><strong>Tổng tiền:</strong> {order.totalAmount} VND</p>
              <p><strong>Sản phẩm:</strong></p>
              <ul>
                {order.products.map((item, index) => (
                  <li key={index}>ID: {item.productId} - Số lượng: {item.quantity}</li>
                ))}
              </ul>
              <button 
                className="btn btn-danger mt-2"
                onClick={() => handleCancelOrder(order._id)}
              >
                Huỷ Đơn
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;
