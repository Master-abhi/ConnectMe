const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const passport = require('passport')

console.log('user.js loaded')

router.get("/user/:id", passport.checkAuthentication,userController.user);
router.post("/update/:id", passport.checkAuthentication,userController.update);
router.get("/signup", userController.signUp);
router.get("/signin", userController.signIn);




router.post("/create", userController.create);
// router.post("/signIn-session", userController.createSession);
router.post('/signIn-session', passport.authenticate(
    'local',
    {failureRedirect: "/signin"},
), userController.createSession)

router.get("/signout", userController.destroySession);

module.exports = router;