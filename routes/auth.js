var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
const { check_authentication } = require('../Utils/check_auth');
let crypto = require('crypto')
let mailMiddleware = require('../Utils/sendMail')

router.post('/signup', async function (req, res, next) {
  try {
    let body = req.body;
    let result = await userController.createUser(
      body.username,
      body.password,
      body.email,
      'customer'
    )
    res.status(200).send({
      success: true,
      data: result
    })
  } catch (error) {
    next(error);
  }

})
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../Utils/constants').SECRET_KEY;

router.post('/login', async function (req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let user = await userController.checkLogin(username, password);

    console.log("== USER TRƯỚC KHI TẠO TOKEN:", user);

    if (!user) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const token = jwt.sign(
      {
        id: user._id?.toString(),
        username: user.username
      },
      SECRET_KEY,
      {
        expiresIn: '7d'
      }
    );

    console.log("Token được tạo:", token);

    res.status(200).send({
      success: true,
      token: token,
      data: user
    });

  } catch (error) {
    next(error);
  }
});

router.get('/me',  check_authentication, async function (req, res, next) {
  try {
    res.status(200).send({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
});

router.post('/forgotpasswood', async function (req, res, next) {
  let body = req.body;
  let email = body.email;
  let user = await userController.getUserByEmail(email);
  user.resetPasswordToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordTokenExp = new Date(Date.now() + 30 * 60 * 1000).getTime();
  await user.save();
  let url = `http://localhost:3000/auth/changepasswordforgot/${user.resetPasswordToken}`;
  let result = await mailMiddleware.sendmail(user.email, "link tim lai mk", url)
  res.send({
    message: `da gui thanh cong`
  })
})
const bcrypt = require('bcrypt'); // thêm dòng này ở đầu file nếu chưa có

router.post('/changepasswordforgot/:token', async function (req, res, next) {
  let body = req.body;
  let token = req.params.token;
  let password = body.password;

  let user = await userController.getUserByToken(token);
  if (!user) return res.status(400).send("Token không hợp lệ");

  if (user.resetPasswordTokenExp > Date.now()) {
    const salt = await bcrypt.genSalt(10); // 🔒 tạo salt
    const hashedPassword = await bcrypt.hash(password, salt); // 🔐 mã hóa mật khẩu

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExp = null;

    await user.save(); // ✅ lưu mật khẩu đã mã hóa

    res.send("Đã cập nhật mật khẩu thành công");
  } else {
    res.send("Token không chính xác hoặc đã hết hạn");
  }
});


module.exports = router