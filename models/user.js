var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var userSchema = new Schema({
    email : String,
    pass : String
}, { collection: 'User' });


module.exports = mongoose.model('User', userSchema, 'User');