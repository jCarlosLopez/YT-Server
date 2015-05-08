var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var videoSchema = new Schema({
    title : String,
    description : String,
    tags : String,
    privacy : String,
    channel : String,
    resource_name : String,
    uploaded : Boolean
});

//-> METHODS
videoSchema.methods.test = function(param) {
  console.log(param);
};

module.exports = mongoose.model('video', videoSchema);