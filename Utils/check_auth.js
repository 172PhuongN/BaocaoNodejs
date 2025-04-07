let jwt = require('jsonwebtoken')
let constants = require('../Utils/constants')
let userController = require('../controllers/users')
module.exports = {
  check_authentication: async function (req, res, next) {
    try {
      let token;
  
      // Kiểm tra token trong header Authorization
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
  
      console.log("=== Token nhận được:", token);
  
      if (!token) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập." });
      }
  
      // Giải mã token
      const verifiedToken = jwt.verify(token, constants.SECRET_KEY);
      console.log("=== Token đã xác thực:", verifiedToken);
  
      // Kiểm tra xem có chứa id không
      if (!verifiedToken.id) {
        return res.status(401).json({ message: "Token không chứa thông tin người dùng." });
      }
  
      // Lấy thông tin người dùng từ token
      const user = await userController.getUserById(verifiedToken.id);
      console.log("=== Người dùng từ DB:", user);
  
      if (!user) {
        return res.status(401).json({ message: "Người dùng không tồn tại hoặc đã bị xóa." });
      }
  
      req.user = user; // Lưu thông tin người dùng vào req
      next();  // Tiếp tục với middleware tiếp theo
  
    } catch (error) {
      console.error("Lỗi xác thực:", error.message);
      return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
  },
  
  check_authorization: function (roles) {
    return function (req, res, next) {
      if (roles.includes(req.user.role.roleName)) {
        next();
      } else {
        throw new Error("ban khong co quyen")
      }
    }
  }
}