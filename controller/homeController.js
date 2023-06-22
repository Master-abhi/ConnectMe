const Post = require("../models/post")
const Comment = require("../models/comments");
const User = require("../models/user")

module.exports.home = async function(req, res){
    const user = req.user;
    try {
        const posts = await Post.find({})
        .sort('-createdAt')
        .populate("user").populate({
          path: "comments",
          populate: {
            path: 'user'
          }
        });
        const comments = await Comment.find({})

        try {
          const all_users = await User.find({});
          
          res.render('home', {

            title: "ConnectMe | home",
            user: user,
            posts: posts,
            comments: comments,
            all_user: all_users,

          });
        } catch (err) {
          // Handle any errors that occurred during the database query or rendering
          console.error(err);
          res.status(500).send('Internal Server Error');
        }

          
        
      } catch (err) {
        console.log(err);
        // Handle the error in an appropriate way
      }}
      
    

module.exports.practice = function(req, res){
    return res.end("<h1>practice</h1>")
}