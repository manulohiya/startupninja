var mongoose = require('mongoose'),
Schema = mongoose.Schema;

//Idea Scema
var ideaSchema = new Schema({ 
  company: String,
  market: String,
  loves: Number,
  hates: Number,
  score: Number
   });

var Idea = mongoose.model('Idea', ideaSchema);
console.log("models.js: "+Idea);
module.exports.Idea = Idea;