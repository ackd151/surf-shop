require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const User = require('./models/user');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const seedPosts = require('./seeds');
// seedPosts();


// require routes
const index   = require('./routes/index');
const posts   = require('./routes/posts');
const reviews = require('./routes/reviews');

const app = express();

// connect to db
mongoose.connect('mongodb://localhost:27017/surf-shop', {
  useNewUrlParser: true,  
  useUnifiedTopology: true, 
  useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'conncetion error:'));
db.once('open', () => {
  console.log('Mongo DB Connected!');
})

// use ejs-locals for all ejs templates
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Add moment to every view
app.locals.moment = require('moment');

// Config passport and session
app.use(session({
  secret: 'local session secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

// set local variables middleware
// set user / dev
app.use((req, res, next) => {
  // req.user = { 
  //   "_id" : "6063a96d49df42196c38a915",
  //   "username" : "ack-d"
  //   // "_id" : "606a3bed0683514380db45f2",
  //   // "username" : "bob"
  //   // "_id": '606b84fce339312df85e5131',
  //   // "username": 'bill'
  // }
  res.locals.currentUser = req.user;
  // set default page title
  res.locals.title = 'Surf Shop';
  // set success/error flash messages
  res.locals.success = req.session.success || '';
  delete req.session.success;
  res.locals.error = req.session.error || '';
  delete req.session.error;
  next();
});

// Mount routes
app.use('/', index);
app.use('/posts', posts);
app.use('/posts/:id/reviews', reviews);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  req.session.error = err.message;
  res.redirect('back'); // goes back to previous page

  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
