const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const logger = require('morgan');
const flash = require('express-flash-messages')
const port = 3000;

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'dsjkhfsdhfjsdh jfbsdjfgds bfshd jfjhsdgfjhsdjh',
  resave: false,
  saveUninitialized: true,
}))

// Auth check middleware
app.use((req, res, next) => {
  const { userId, email, userType, name } = req.session;
  const whiteList = ['/auth/sign-in', '/auth/sign-up'];
  res.locals.userId = userId || null;
  res.locals.email = email || null;
  res.locals.userType = userType || null;
  res.locals.name = name || null;
  // if (whiteList.includes(req.url) || userId) {
  //   next()
  // } else {
  //   res.redirect('/auth/sign-in');
  // }

  next()
});

app.use(flash())

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log('App is running on localhost:', port))

module.exports = app;
