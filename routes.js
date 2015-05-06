
var passport = require('passport')
  , User = require('./models/user') 

module.exports = function (app){
  
  
  
  // INDEX GET ROUTE
  app.get('/', function(req, res) {
    
    /*
    if (req.cookies == null) {
      // if user is not logged-in redirect back to login page //
      console.log("not logged in");
      res.redirect('/login');
    } else {
      console.log("logged in");
      res.render('index');
    }
    */
  });
  
  app.get('/login', function(req, res) {
    
    res.render('login');
  });
  
  app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect('/upload/' + req.user.username);
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
  
  
  
  
}

