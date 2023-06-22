const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/ConnectMe_development");

const db = mongoose.connection;

db.on('error', console.error.bind(console, "error during connecting DB"));

db.once('open', function(){
    console.log('Connected successfully to MongoDB')
});

module.exports = db;