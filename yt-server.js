var express = require('express');
//Express Web Server
var busboy = require('connect-busboy');
//middleware for form/file upload
var path = require('path');
//used for file path
var fs = require('fs-extra');
//File System - for file manipulation


var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');



// INDEX GET ROUTE
app.get('/', function(req, res) {
  res.render('index');
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