//jshint esversion:6
const multer = require('multer');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

const router = express.Router();

const swig = require('swig');
const path = require('path');
const homeStartingContent = "Home Content----------Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sodales neque sodales ut etiam sit amet nisl purus in. Lorem donec massa sapien faucibus et. Sollicitudin nibh sit amet commodo nulla. Arcu felis bibendum ut tristique. Porttitor rhoncus dolor purus non enim praesent elementum. Convallis aenean et tortor at risus viverra adipiscing at in. Nunc aliquet bibendum enim facilisis. Tristique et egestas quis ipsum suspendisse ultrices gravida dictum. Quam viverra orci sagittis eu volutpat odio.";
const aboutContent = "About Content----------Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sodales neque sodales ut etiam sit amet nisl purus in. Lorem donec massa sapien faucibus et. Sollicitudin nibh sit amet commodo nulla. Arcu felis bibendum ut tristique. Porttitor rhoncus dolor purus non enim praesent elementum. Convallis aenean et tortor at risus viverra adipiscing at in. Nunc aliquet bibendum enim facilisis. Tristique et egestas quis ipsum suspendisse ultrices gravida dictum. Quam viverra orci sagittis eu volutpat odio.";
const contactContent = "Contact Content-----------Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sodales neque sodales ut etiam sit amet nisl purus in. Lorem donec massa sapien faucibus et. Sollicitudin nibh sit amet commodo nulla. Arcu felis bibendum ut tristique. Porttitor rhoncus dolor purus non enim praesent elementum. Convallis aenean et tortor at risus viverra adipiscing at in. Nunc aliquet bibendum enim facilisis. Tristique et egestas quis ipsum suspendisse ultrices gravida dictum. Quam viverra orci sagittis eu volutpat odio.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('uploads', express.static('uploads'));
mongoose.connect("mongodb+srv://sanuj:firsthosting@cluster0.eo7aw.mongodb.net/blogDB", { useNewUrlParser: true });
// mongoose.createConnection("mongodb://localhost:27017/blogDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const postSchema = {
  title: String,
  content: String,
  author: String,
  img: String,
  date: String,
  visit: { type: Number, default: 0 },
};



const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});


app.post("/compose", function (req, res) {
  console.log(req.body);

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    author: req.body.postAuthor,
    img: req.body.img,
    date: new Date(Date.now()).toDateString(),

  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOneAndUpdate({ _id: requestedPostId }, { $inc: { visit: 1 } }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
      author: post.author,
      img: post.img,
      date: post.date,
      vis: post.visit + 1,
    });
  });
});
var userCount = 0;


app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });



});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server has started successfully");
});
