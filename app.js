const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authenticateUser = require('./middleware/authenticate');

const usersRouter = require('./routes/users');
const authenticatedUsersRouter = require('./routes/authenticatedUsers');
const itemsRouter = require('./routes/items');
const transactionsRouter = require('./routes/transactions');
const currenciesRouter = require('./routes/currencies');

const createConnection = require('./database/createConnection');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cors({
  credentials:true, origin:'http://localhost:3000'
}));

//database conection
const connection = createConnection();

app.use(express.static("./public"))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/items', itemsRouter);
app.use('/currencies', currenciesRouter);
app.use('/users', authenticatedUsersRouter);
app.use('/transactions', transactionsRouter);

app.use('/', authenticateUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
