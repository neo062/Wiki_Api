const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set(' view engine ', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
// Contencting with mongodb
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true
});
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

// Request targeting all articles
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundItem) {
      if (!err) {
        res.send(foundItem);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Succesful ");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Deleted Succesfully");
      } else {
        res.send(err);
      }
    });
  });

// targeting single article
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundtitle) {
      if (foundtitle) {
        res.send(foundtitle);
      } else {
        res.send("Non article found mathching the title");
      }
    });
  })
  .put( function(req,res){
    Article.update({
        title: req.params.articleTitle
      },
      {
        title: req.body.title,
        content: req.body.content
      },
       {
        overwriten: true
        },
      function(err) {
        if (!err) {
          res.send("Updated Succesfully");
        }
      }
    );
    })
    .patch(function(req,res){
      Article.update({title: req.params.articleTitle},
      {$set :req.body},
    function(err){
      if(!err){
        res.send("Updated Succesfully");
      }else{
        res.send(err);
      }
    });
    })
    .delete(function(req,res){
      Article.deleteOne({title:req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Deleted Succesfully");
        }else{
          res.send(err);
        }
      });
    });


app.listen(3000, function() {
  console.log("You are on Port 3000");
});
