//Express Web Server
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , busboy = require('connect-busboy')                      // Middleware for form/file upload
  , path = require('path')                                  // Used for file path
  , fs = require('fs-extra')                                // File System - for file manipulation
  , cookieParser = require('cookie-parser')                 // Cookies
  , passport = require('passport')                          // Passport
  , mongoose = require('mongoose')                          // Mongoose
  ,    Schema = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose')
  , logger = require('morgan')                              // Morgan Logger
  , path = require('path')                                  // Path
  , session = require('express-session')
  , LocalStrategy = require('passport-local').Strategy;
  //, TwitterStrategy = require('passport-twitter').Strategy;


  // DB Config
  var dbConfig = require('./db.js');



var app = express();

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.set('port', process.env.PORT || 3030);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(busboy());
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  
  app.use(session({
    secret: "J8eZXZmp4a",
    resave: true,
    saveUninitialized: true
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(path.join(__dirname, 'public')));
  app.use("/public", express.static(path.join(__dirname, 'public')));
  app.locals.pretty = true; // Print pretty html on development environment
}
// DB Connect
mongoose.connect(dbConfig.url);




// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'user' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ handle: username, pass: password }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      return done(null, user.userId);
    });
  }
));


















/* (De)Serialization Functions */
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



// Setup routes
require('./routes')(app);

var server = app.listen(3030, function() {
  console.log('Listening on port %d', server.address().port);
}); 