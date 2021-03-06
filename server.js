var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Defining handlebars as the view engine
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/MongoDB_scraping", {
  // useMongoClient: true
});


// A GET route for scraping the website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab a unique element that will help us single out the article, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.summary = $(this)
        .find(":contains('summary')")
        .text();
        
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(result);
          // console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});


// Route for getting all Articles from the db
app.get("/", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
  .then(function(dbArticle){
    console.log(dbArticle);
    // render all the articles back to the client
    res.render("index", {articles: dbArticle});
    // res.json(dbArticle);
  })//promise ends here
  .catch(function(err) {
    // If an error occurs, send the error back to the client
    res.json(err);
  });
});






// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
