const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();
// db
const db = require('./config/db').mongoURI
// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
// Passport Config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());
// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.errors_msg = req.flash('errors_msg');
  res.locals.errors = req.flash('errors');
  next();

})

mongoose .connect( db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('kết nối thành công'))
  .catch(err => console.log(err));
// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.static(path.join(__dirname, 'css')));

app.use(express.urlencoded({extended: true}))
// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'))
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Sever started on port ${PORT}`));