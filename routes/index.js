const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController")
const passport = require('passport')
console.log("router loaded");

router.get('/', homeController.home);
router.get("/user/:id", require("./user"));
router.post("/update/:id", require("./user"));
router.get("/post", require("./post"));
router.post("/new-post", require("./post"));
router.get("/destroy/:id", require("./post"));
router.post("/new-comment", require("./post"));
router.get("/destroyComment/:id", require("./post"));
router.get("/signup", require("./user"))
router.get("/signin", require("./user"))
router.post("/create", require("./user"));
router.post("/signIn-session", require("./user"));
router.get("/signout", require("./user"));




module.exports = router;