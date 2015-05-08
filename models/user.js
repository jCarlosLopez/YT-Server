var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
  user  : String,
  pass  : String
});


//-> EXPORT
module.exports = mongoose.model('User', userSchema);