const Post = require('../models/post')
const Comment = require('../models/comments')

module.exports.post = function(req, res){
    if (!req.isAuthenticated()){
        return res.redirect("/signin");
      }
      const user = req.user;
    return res.render('post', {
        title: "post",
        user: user,
        
    });
};

module.exports.newPost = async function(req, res){
    if (!req.isAuthenticated()){
        return res.redirect("/signin");
    };
    try {
        const post = await Post.create({
          content: req.body.content,
          user: req.user._id,
        });

        if (req.xhr){
           return res.status(200).json({
            data:{
              post: post
            },
            message: "post created!"
          })

        }
          console.log("Post created")
          req.flash('success', 'Posted!!');
          return res.redirect('/');
        
      } catch (err) {
        console.log(err);
        return; // or handle the error in an appropriate way
      }
}


module.exports.destroy = async function(req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      post.deleteOne();
      
      await Comment.deleteMany({ posts: req.params.id });

      if(req.xhr){
        return res.status(200).json({
          data:{
            post_id: req.params.id
          },
          messege: 'Post deleted'
        })
      }


      req.flash('success', 'Post deleted!!');
      return res.redirect('/');
    } else {
      return res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    // Handle the error appropriately (e.g., sending an error response)
  }
}

module.exports.newComment = async function(req, res){
  if (!req.isAuthenticated()){
      return res.redirect("/signin");
  };
  try {
        const post = await  Post.findById(req.body.post);
        if (post){
            const comment = await Comment.create({
            content: req.body.content,
            user: req.user._id,
            posts: req.body.post
          });

        // if(req.xhr){
          
        //   return res.status(200).json({
        //     data:{
        //       comment: comment
        //     },
        //     message: "commented"
        //   })
        // };


        console.log("Comment created")
        req.flash('success', 'Commented!!')
        post.comments.push(comment);
        post.save();
        return res.redirect('/');
      }
      
      


    } catch (err) {
      console.log(err);
      return; // or handle the error in an appropriate way
    }
}

module.exports.destroyComment = async function(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      let postId = comment.post;

      await comment.deleteOne();

      await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
      req.flash('success', 'comment deleted!!');
      return res.redirect('/');
    } else {
      return res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    // Handle the error appropriately (e.g., sending an error response)
  }
}