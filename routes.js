
var passport = require('passport')
  , Video = require('./models/video')
  , bodyParser = require('body-parser')
  , fs = require('fs-extra')

module.exports = function (app){

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/login');
  }

  // INDEX GET ROUTE
  app.get('/', isLoggedIn ,function(req, res) {
      //res.render('index');
      res.redirect('/upload');
  });

  app.get('/login', function(req, res) {
    res.render('login');
  });

  /* Handle Login POST */
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/upload',
    failureRedirect: '/login',
    failureFlash : true // allow flash messages
  }));

  // Logout
  app.get('/logout', isLoggedIn, function(req, res){
    req.logout();
    res.redirect('/login');
  });

  // UPLOAD GET ROUTE
  app.get('/upload', isLoggedIn, function(req, res) {
      res.render('upload');
  });

  /* ==========================================================
   Create a Route (/upload) to handle the Form submission
   (handle POST requests to /upload)
   Express v4  Route definition
   ============================================================ */
  app.post('/upload', isLoggedIn,function(req, res, next) {

    var fstream;
    req.pipe(req.busboy);

    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      req.body[fieldname] = val;
    });


    req.busboy.on('file', function(fieldname, file, filename) {
      req.body['filename'] = filename;
      //Path where image will be uploaded
      fstream = fs.createWriteStream(__dirname + '/uploads/' + filename);
      file.pipe(fstream);
      fstream.on('close', function() {

      });

    });


    req.busboy.on('finish', function() {
      var video = new Video({
        title : req.body['title'],
        description : req.body['description'],
        tags : req.body['tags'],
        privacy : req.body['privacy'],
        channel : req.body['channel'],
        resource_name : req.body['filename'],
        uploaded : false
      });

      video.save(function (err, data) {
        if (err){
          console.log(err);
          res.status(500).end();
        }else{
          console.log('Saved : ', data );
          res.redirect('/queue');
        }
      });

    });






  });

  app.get('/queue', isLoggedIn,function(req, res) {
    Video.find({}, function(err, videos) {
      var videoMap = {};

      videos.forEach(function(user) {
        videoMap[user._id] = user;
      });
      console.log(videoMap);
      //res.send(videoMap);
      res.render('queue', {videos: videoMap});
    });
  });




}

