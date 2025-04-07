import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(""); // debug log

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token lấy từ localStorage: ", token);

    if (!token) {
      setError("Vui lòng đăng nhập!");
      setDebugInfo("Không tìm thấy token trong localStorage.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Phản hồi từ API /auth/me: ", response.data);
        if (response.data && response.data.data) {
          setUserData(response.data.data);
        } else {
          setDebugInfo("API trả về không có userData hoặc là null.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi từ API:", err);
        setError("Đã xảy ra lỗi khi tải thông tin người dùng.");
        setDebugInfo(err.response?.data?.message || err.message || "Không rõ lỗi.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải...</div>;

  if (error) {
    return (
      <div>
        <p className="text-danger">{error}</p>
        {debugInfo && <pre className="text-muted">Debug: {debugInfo}</pre>}
      </div>
    );
  }

  if (!userData) {
    return (
      <div>
        <p className="text-warning">Không tìm thấy thông tin người dùng.</p>
        {debugInfo && <pre className="text-muted">Debug: {debugInfo}</pre>}
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h1>Thông tin người dùng</h1>

      {userData.avatar ? (
        <img
          src={userData.avatar || undefined}
          alt="User Avatar"
          width="100"
          height="100"
        />
      ) : (
        <span>Chưa có ảnh đại diện</span>
      )}

      <div>
        <strong>Tên người dùng: </strong>{userData.username}
      </div>
      <div>
        <strong>Email: </strong>{userData.email}
      </div>
      <div>
        <strong>Vai trò: </strong>{userData.role}
      </div>
    </div>
  );
};

export default UserProfile;
