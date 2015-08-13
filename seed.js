// require express framework and additional modules
var express = require('express'),
    app = express(),
    cors = require('cors'),
    mongoose = require('mongoose'),
    env = process.env
    db = require('./models')
   
// Connect to database
// mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/startupninja2');
mongoose.connect(env.MONGOLAB_URI);
// OPEN THE API TO REQUESTS FROM ANY DOMAIN
app.use(cors());



// Show connection error if there is one
// db.on('error', console.error.bind(console, 'Database Connection Error:'));

 	
 	// var company = ["Chat Roulette","Tinder", "altSchool", "Medium", "Zipcar", "General Assembly", "HotelTonight", "BirchBox", "Waze", "uber", "airbnb", "Snapchat", "SpaceX", "Dropbox", "Spotify", "Venmo", "Slack", "Tesla", "Lyft", "Instacart", "Blue Apron", "Netflix", "Google Docs", "Gilt", "Shazam", "Lending Club", "Zillow", "HBO", "ebay", "amazon"];
 	var company = ["PayPal", "Github", "Vine", "Squarespace", "Pandora", "Soundcloud", "Spotify", "Etsy", "Youtube", "Yelp", "ProductHunt", "Google Maps", "Postmates", "Facebook", "LinkedIn", "Seamless", "Pinterest", "Instagram"];
	// var market = ["Home Cooked Food", "Family Owned Restaurants", "Organic Farming", "Personal Investing"];
	var market = ["home cooked food", "family owned restaurants", "organic farming", "personal investing", "mobile advertising", "casual video games", "console games", "space travel", "online dating", "professional wrestling","air travel","private jets","hand made ethnic clothing","collector cars", "trips to national parks", "self driving cars","peer to peer banking", "online videos", "stock trading", "DNA sequencing", "call centers", "cargo","nuclear weapons","professional services","handyman services","beauty products", "organic produce", "brick and mortar stores", "lifelong education", "elementary education", "coding bootcamps", "on demand grocery services", "high quality health care", "in home health care", "visa services", "legal services", "independent music", "live concerts", "retirement plans", "generic medicines", "former athletes", "real estate", "apartment rentals", "beauty products", "Amateur Sports", "Middle Aged Men", "Middle Aged Women", "Baby Boomers", "Babies", "Pets", "High School Kids", "Law Students", "South East Asia", "the midwest", "mainland china"];

for (var i = 0; i < company.length; i++){
	for (var j = 0; j < market.length; j++){
	var idea = new db.Idea(
		{company: company[i],
			market: market[j],
			loves: 0,
			hates: 0,
			score: 0
			}); 
		console.log(idea);
		idea.save();
		}
}




