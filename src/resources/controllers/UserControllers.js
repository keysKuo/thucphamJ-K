const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
function hashPassword(password) {
  let saltRounds = 10;
  let salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}
const UserController = {
  getLogin: (req, res, next) => {
    const error = req.flash('error') || '';
    const username = req.flash('username') || '';
    const password = req.flash('password') || '';
    res.render('login', { error, username, password });
  },
  postLogin: (req, res, next) => {
    const { username, password } = req.body;
    let account = undefined;
    return Users.findOne({ username: username })
      .then((acc) => {
        if (!acc) {
          req.flash('error', 'Username ' + username + ' không tồn tại');
          return res.redirect('/users/login');
        } else {
          account = acc;
          return bcrypt.compareSync(password, acc.password);
        }
      })
      .then((match) => {
        if (!match) {
          req.flash('error', 'Mật khẩu không chính xác');
          return res.redirect('/users/login');
        } else {
          const JWT_SECRET = 'co5sg';
          return jwt.sign(
            {
              username: account.username,
            },
            JWT_SECRET,
            {
              expiresIn: '30m',
            },
            (err, token) => {
              if (err) {
                req.flash('error', 'Đăng nhập thất bại ' + err);
                res.redirect('/users/login');
              } else {
                req.session.username = account.username;
                req.session.position = account.position;
                req.session.token = token;
                req.flash('success', 'Đăng nhập thành công');
                return res.redirect('/admin/');
              }
            }
          );
        }
      });
  },
  getRegister: (req, res, next) => {
    let error = req.flash('error') || '';
    let username = req.flash('username') || '';
    let password = req.flash('password') || '';
    let email = req.flash('email') || '';
    let phone = req.flash('phone') || '';
    let success = req.flash('success') || '';
    let fullname = req.flash('fullname');
    res.render('register', {
      position: req.session.position,
      layout: 'admin',
      pageName: 'Tạo tài khoản',
      success,
      error,
      fullname,
      username,
      password,
      email,
      phone,
    });
  },

  postRegister: (req, res, next) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
      const user = {
        username: req.body.username,
        password: hashPassword(req.body.password),
        fullname: req.body.fullname,
        position: req.body.position,
        email: req.body.email,
        phone: req.body.phone,
      };
      return new Users(user)
        .save()
        .then(() => {
          req.flash('success', 'Đăng ký thành công');
          res.redirect('/users/register');
        })
        .catch(() => {
          req.flash('error', 'Đăng ký thất bại');
          res.redirect('/users/register');
        });
    } else {
      result = result.mapped();
      let message;
      for (let f in result) {
        message = result[f].msg;
        break;
      }
      const { username, fullname, email, phone, password } = req.body;
      req.flash('error', message);
      req.flash('username', username);
      req.flash('fullname', fullname);
      req.flash('email', email);
      req.flash('phone', phone);
      req.flash('password', password);
      res.redirect('/users/register');
    }
  },

  getChangePassword: (req, res, next) => {
    let error = req.flash('error') || '';
    let oldPassword = req.flash('oldPassword') || '';
    let newPassword = req.flash('newPassword') || '';
    let success = req.flash('success') || '';
    res.render('changePassword', {
      pageName: 'Đổi mật khẩu',
      position: req.session.position,
      layout: 'admin',
      error,
      oldPassword,
      newPassword,
      success,
    });
  },

  postChangePassword: (req, res, next) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
      const username = req.session.username;
      const newPassword = req.body.newPassword;

      return Users.findOneAndUpdate({ username: username }, { password: hashPassword(newPassword) }, (err, data) => {
        if (error) {
          req.flash('error', 'Đổi mật khẩu thất bại');
          res.redirect('/users/changePassword');
        } else {
          req.flash('success', 'Đổi mật khẩu thành công');
          res.redirect('/users/changePassword');
        }
      });
    } else {
      let message;
      result = result.mapped();
      for (let f in result) {
        message = result[f].msg;
        break;
      }
      const { oldPassword, newPassword } = req.body;
      req.flash('error', message);
      req.flash('oldPassword', oldPassword);
      req.flash('newPassword', newPassword);
      res.redirect('/users/changePassword');
    }
  },

  getLogout: (req, res) => {
    req.session.destroy();
    res.redirect('/users/login');
  },

  // client controller

  getRegisterPages: (req, res, next) => {
    return res.render('register');
  },
  getForgotPasswordPage: (req, res, next) => {
    return res.render('forgotPassword', {
      pageName: 'Đổi mật khẩu',
    });
  },
  getNewPasswordPage: (req, res, next) => {
    return res.render('newPassword', {
      pageName: 'Đổi mật khẩu',
    });
  },
  getQRCodePage: (req, res, next) => {
    return res.render('QRCode', {
      pageName: 'QRCode',
    });
  },
  getOTPPage: (req, res, next) => {
    return res.render('OTP', {
      pageName: 'Đổi mật khẩu',
    });
  },
};

module.exports = UserController;
