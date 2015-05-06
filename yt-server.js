var express = require('express');
//Express Web Server
var busboy = require('connect-busboy');
//middleware for form/file upload
var path = require('path');
//used for file path
var fs = require('fs-extra');
//File System - for file manipulation
var cookieParser = require('cookie-parser')
// Cookies

var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('view engine', 'jade');


// Print pretty html on development environment
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}


// INDEX GET ROUTE
app.get('/', function(req, res) {
  
  console.log(req.session.user);

  if (req.cookies == null) {
    // if user is not logged-in redirect back to login page //
    console.log("not logged in");
    res.redirect('/login');
  } else {
    console.log("logged in");
    res.render('index');
  }

});

app.get('/login', function(req, res) {
  
  res.render('login');
});

// UPLOAD GET ROUTE
app.get('/upload', function(req, res) {
  res.render('upload');
});

/* ==========================================================
 Create a Route (/upload) to handle the Form submission
 (handle POST requests to /upload)
 Express v4  Route definition
 ============================================================ */
app.route('/upload').post(function(req, res, next) {

  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    console.log("Uploading: " + filename);

    //Path where image will be uploaded
    fstream = fs.createWriteStream(__dirname + '/uploads/' + filename);
    file.pipe(fstream);
    fstream.on('close', function() {
      console.log("Upload Finished of " + filename);
      res.redirect('/upload/success');
      //where to go next
    });
  });
  
});

// UPLOAD SUCCESS GET ROUTE
app.get('/upload/success', function(req, res) {
  res.render('upload_success');
});

var server = app.listen(3030, function() {
  console.log('Listening on port %d', server.address().port);
}); 