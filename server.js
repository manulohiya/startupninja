// require express framework and additional modules
var express = require('express'),
app = express(),
_ = require('underscore'),
cors = require('cors'),
mongoose = require('mongoose'),
db = require('./models'),
s = require("underscore.string"),
bodyParser = require('body-parser'),
// migrate = require('mongo-migrate'),
maxLimit = 10;

// Connect to database
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/startupninja2');

// OPEN THE API TO REQUESTS FROM ANY DOMAIN
app.use(cors());

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

// serve js and css files from public folder
// app.use(express.static(__dirname + '/public'));
app.use(express.static(process.env.PWD + '/public'))

// Randomizer function
var getRand = function(min,max) {
 float_num = Math.random() * (max - min) + min;
 rand = Math.floor(float_num);
 return rand
}

// Fisher Yates randomizer
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array[getRand(0,array.length-1)];
}



//Static Routes


// set up root route to respond with 'hello world'
app.get('/', function (req, res) {
  // res.sendFile(__dirname + '/startup_gen/public/index.html');
  res.sendFile(process.env.PWD + '/public/index.html')
});

// generate all ideas and send to client
app.get('/api/ideas', function (req, res) {
 db.Idea.find(function(err, ideas){
  console.log("Ideas: "+ideas);
  res.json(ideas);
});
});

// generate random idea and send to client
app.get('/api/ideas/random', function (req, res) {
  // send all phrases as JSON response
 // randomIdea = shuffle(ideas);
 db.Idea.find(function(err,ideas){
   randomIdea = shuffle(ideas);
   console.log(randomIdea)
   res.json(randomIdea);
 });
});

// get one specfic idea
app.get('/api/ideas/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;
  console.log(targetId);
  // find phrase in db by id
  db.Idea.findOne({_id: targetId}, function (err, foundIdea) {
    res.json(foundIdea);

  });

});


// update the love counter
app.put('/api/ideas/:id/loves', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find idea in db by id
  db.Idea.findOne({_id: targetId}, function (err, foundIdea) {
    // update the idea's love counter
    foundIdea.loves += 5;
    foundIdea.score += 5;
    
    // save updated idea in db
    foundIdea.save(); 
  });
});

// update the hates counter
app.put('/api/ideas/:id/hates', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find idea in db by id
  db.Idea.findOne({_id: targetId}, function (err, foundIdea) {
    // update the idea's love counter
    foundIdea.hates += 3;
    foundIdea.score -= 3;
    
    // save updated idea in db
    foundIdea.save(); 
  });
});

// Top X  query 

app.get('/api/ideas/search/top', function (req, res) {
  console.log("Gettin high")

  db.Idea.find().sort({score: -1}).limit(maxLimit).exec(function(err, ideas){
    console.log("Ideas: "+ideas);
    res.json(ideas);
  });

  

});

// Custom Search by company or market name
app.get('/api/ideas/search/:query', function (req, res) {


	var query = req.params.query;
	
	console.log(query);
	// var regexVal = '/^' + query + '/i';
	var regexVal = new RegExp("^.*"+query+".*","gi");
	console.log(regexVal);

// Find all ideas that match either market or company
db.Idea.find({"$or" : [{"market":{ $regex: regexVal }}, {"company":{ $regex: regexVal }}]}).sort({score: -1}).limit(maxLimit).exec(function(err, ideas) {
  res.json(ideas);
});	

});


// Autocomplete company
app.get('/api/ideas/search/:query/autocomplete/company', function (req, res) {

  var query = req.params.query;
  console.log(query);
  // var regexVal = '/^' + query + '/i';
  var regexVal = new RegExp("^.*"+query+".*","gi");

// Find all ideas that match company
db.Idea.find({"company":{ $regex: regexVal }}).sort({score: -1}).limit(maxLimit).exec(function(err, ideas) {
  var i = 0;
  var autoComplete1 = [];
  console.log(ideas.length);
  while (i < ideas.length) {

    autoComplete1[i] = ideas[i].company
    i++;
  }; 

    //Get unique values
    var autoComplete1 = autoComplete1.filter(function(item, i, ar)
      { return ar.indexOf(item) === i; 
      });

    console.log(autoComplete1)
       res.json(autoComplete1);

     });

});

// Autocomplete company
app.get('/api/ideas/search/:query/autocomplete/market', function (req, res) {

 var query = req.params.query;
  console.log(query);
  // var regexVal = '/^' + query + '/i';
  var regexVal = new RegExp("^.*"+query+".*","gi");

// Find all ideas that match market
db.Idea.find({"market":{ $regex: regexVal }}).sort({score: -1}).limit(maxLimit).exec(function(err, ideas) {
  var i = 0;
  var autoComplete2 = [];
  console.log(ideas.length);
  while (i < ideas.length) {

    autoComplete2[i] = ideas[i].market
    i++;
  }; 

       //Get unique values
       var autoComplete2 = autoComplete2.filter(function(item, i, ar)
        { return ar.indexOf(item) === i; 
        });

       // var autoComplete = autoComplete1.concat(autoComplete2);  
       // console.log(autoComplete);

       console.log(autoComplete2)
       res.json(autoComplete2);

     }); 

});



// IDEAS#CREATE
app.post('/api/ideas', function(req, res) {
  // SAVE LINE TO DB
  var idea = new db.Idea({
    company: req.body.company,
    market: req.body.market,
    loves: 0,
    hates: 0,
    score: 0
  });
  console.log(idea);
  idea.save(function(err,idea){ 
    res.json(idea);
  });
});


// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('server started on localhost:3000');
});