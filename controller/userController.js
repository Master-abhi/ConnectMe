const User = require("../models/user")
const passport = require('passport');
const fs = require('fs');
const path = require('path');
// const passport = require("passport-local")


module.exports.user = async function(req, res) {
  if (!req.isAuthenticated()) {
    // User not authenticated, handle accordingly (e.g., redirect to sign-in page)
    return res.redirect('/signin');
  }

  // User authenticated, access user data
  const user = req.user;
  try{
    const all_users = await User.findById(req.params.id);
  
    res.render('user', {
      title: 'User Profile',
      user: user,
      email: user.email,
      name: user.name,
      all_user:  all_users
  });

  }catch (err) {
    // Handle any errors that occurred during the database query or rendering
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  
};


module.exports.update = async function(req, res){
  if (req.user.id == req.params.id){
    try{
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function(err){
        if (err){
          console.log(err);
       }
        console.log(req.file)

        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file){

          if (!user.avatar){
            console.log("no file found in db")
            
          }else{
            
            fs.unlinkSync(path.join(__dirname, "..",  user.avatar));
          }
          //this is saving avatar's path to user
          user.avatar = User.avatarPath + "/" + req.file.filename
        }

        user.save()
        return res.redirect('back')
       
      })
      }catch(error){
        console.log(error)
    }
    
  }else{
    console.log("not authorized")
  }
}

// for sign-up
module.exports.signUp = function(req, res){
  if (req.isAuthenticated()){
    return res.redirect("/user");
  }


    return res.render('signup', {
        title: "ConnectMe | Sign-Up",
    });
};

// for sign-in
module.exports.signIn = function(req, res) {
  // Render the sign-in page
  if (req.isAuthenticated()){
    return res.redirect("/user");
  }
  return res.render('signin', {
    title: 'Sign In'
  });
};


module.exports.create = async function(req, res) {
    try {
      if (req.body.password !== req.body.confirm_password) {
        console.log("Password and confirm password do not match");
        return res.end("Password and confirm password do not match");
      }
  
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        const newUser = await User.create(req.body);
        console.log("New user created!");
        return res.redirect("/signin");
      } else {
        console.log("User already exists");
        return res.end("User already exists");
      }
    } catch (error) {
      console.error(error);
      return res.redirect("/");
    }
  };
  

  module.exports.createSession = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        // Error occurred during authentication
        return next(err);
      }
      
      if (!user) {
        // Invalid username/password
        console.log('Invalid Username/Password');
        return res.redirect('/signin'); // Redirect to the sign-in page
      }
  
      // Authentication successful, log in the user
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
  
        // Redirect to the home
        req.flash('success', 'Logged in Successfully!!')
        return res.redirect('/');
      });
    })(req, res, next);
  };

  module.exports.destroySession = function(req, res) {
    // Destroy the session
    req.session.destroy(function(err) {
      if (err) {
        console.log('Error destroying session:', err);
        return res.redirect('/'); // Redirect to a suitable route or display an error page
      }
  
      // Redirect the user to the desired route after session destruction
      // req.flash('success', 'Logged out Successfully!!');
      res.redirect('/');
    });
  
    // Set a flash message for successful logout
    // req.flash('success', 'Logged in Successfully!!')
  
    // Redirect the user to a specific route
    
  };
  
