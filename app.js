const { render } = require("ejs");
const express = require("express"); // Express web server framework
const https = require("https"); // HTTPS module
const date = require(__dirname + "/date.js");
const app = express(); // Create a new Express application
const _ = require("lodash");
const dotenv = require("dotenv").config();

app.set("view engine", "ejs"); //this is the view engine
app.use(express.urlencoded({ extended: true })); //this is the body parser
app.use(express.json()); //this is the body parser

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Tullydev:" +
    process.env.MONGO_Atlas_PW2 +
    "@cluster0.2nb24.mongodb.net/BlogDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(express.static("public")); //this is the static file
//global variables
// const posts = [];
//public varilbes that will be removed for the use of mongoDB
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutStartingContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactStartingContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//create schema
const blogSchema = new mongoose.Schema({
  title: { type: String },
  body: { type: String },
});
// create model
const Blog = mongoose.model("Blog", blogSchema);
// create three new blog posts
//  const blog1 = new Blog({
//     title: 'Blog 1',
//     body: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
//   });

// const defualtBlogpost = [blog1];

app.get("/", function (req, res) {
  Blog.find({}, function (err, foundPosts) {
    res.render("home", { postsDisplay: foundPosts });
  }); // end of blog.find
}); //end of app.get

app.post("/compose", function (req, res) {
  const blogTitle = req.body.blogTitle;
  const blogBody = req.body.blogTxt;
  // console.log(blogTitle);
  const newBlog = new Blog({ title: blogTitle, body: blogBody });
  Blog.create(newBlog, function (err, newBlog) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully saved blog post to DB");
      res.redirect("/");
    }
  });
});

app.get("/blogs/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Blog.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.body,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutStartingContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactStartingContent });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port 3000");
});
