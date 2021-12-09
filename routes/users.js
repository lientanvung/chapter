const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');

const User = require('../models/user')
// login page
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
  const {name, email, password, password2} = req.body;
  let errors = [];

  // check required fields
  if(!name || !email || !password || !password2){
    errors.push({msg: 'Vui lòng điền vào tất cả các lĩnh vực'});
  }

  // check password match
  if(password !== password2) {
    errors.push({msg: 'mật khẩu không khớp'});
  }

  // check pass length
  if(password.length < 6){
    errors.push({msg: 'Mật khẩu phải có ít nhất 6 ký tự'});
  }

  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  }else{
   // validation passed
    User.findOne({ email: email})
      .then(user =>{
        if(user){
          errors.push({msg: 'Email đã được đăng ký'});
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
          })
        }
        else{
          const newUser = User({
            name,
            email,
            password,
          });

          // Hash password
          bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(newUser.password, salt, (err, hash) =>{
              if(err) throw err;
              // set password to hashed
              newUser.password = hash;
              // save user
              newUser.save()
                .then(user =>{
                  req.flash('success_msg', 'Bây giờ bạn đã đăng ký và có thể đăng nhập');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            })
          })
        }
      })
  }
})
  
// login handler 
router.post('/login', (req, res, next) =>{
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Bạn đã đăng xuất');
  res.redirect('/users/login');
});
module.exports = router;