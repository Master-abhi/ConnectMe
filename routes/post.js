const express = require("express");
const router = express.Router();
const passport= require("passport");

const postController = require("../controller/postController");

console.log("post.js loaded");

router.get("/post",  passport.checkAuthentication,  postController.post);
router.post("/new-post", postController.newPost);
router.get("/destroy/:id", passport.checkAuthentication, postController.destroy);
router.post("/new-comment", postController.newComment);
router.get("/destroyComment/:id", postController.destroyComment);

module.exports = router;