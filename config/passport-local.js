const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email', // Assuming email is the field used for username
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    try {
      // Find a user by email
      const user = await User.findOne({ email: email });

      if (!user || (user.password != password)) {
        // Invalid username/password
        console.log("Invalid username/password");
        req.flash('error', "Invalid Username/Password!!");
        return done(null, false);
      }

      // User found and password is valid
      req.flash('success', "User found!!");
      return done(null, user);
    } catch (err) {
      // Error in finding user
      return done(err);
    }
  }
));




// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


 
// deserializing the user from the key in the cookies
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        
        if (!user) {
            console.log('User not found');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log('Error in finding user --> Passport');
        return done(err);
    }
});

//check if the user authenticated
passport.checkAuthentication = function (req, res, next){
    // if the is signed in
    if (req.isAuthenticated()) {
        return next();
    }
    //if the user is not signed in
    return res.redirect("/signin")

    

};

passport.setAuthenticatedUser = function (req, res, next){
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    
    }
    return next();
}

module.exports = passport;