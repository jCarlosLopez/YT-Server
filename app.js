//Express Web Server
var express = require('express')
  , routes = require('./routes')
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
  , flash = require('connect-flash')
  , User = require('./models/user')
  , LocalStrategy = require('passport-local').Strategy;
  //, TwitterStrategy = require('passport-twitter').Strategy;


// DB Config
var dbConfig = require('./db.js');


var app = module.exports = express();

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.set('port', process.env.PORT || 3030);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(busboy());
  app.use(flash());
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
//-> CONFIGURATION
mongoose.connect(dbConfig.url, function(err) {
  if (err) {
    console.log("Could not connect to database");
    throw err;
  }else{
    //console.log("Succesfully connected to MongoDB");
  }
});


// passport/login.js
passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'user',
    passwordField : 'pass',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) {

    User.findOne({ 'user' :  username }, function(err, obj) {

        // if there are any errors, return the error before anything else
        if (err)
            return done(err);

        // if no user is found, return the message
        if (!obj){
          console.log("No user found");
          return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        }

        if(obj.pass == password){
          return done(null, obj);
        }else{
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        }

    });

}));


/* (De)Serialization Functions */
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
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