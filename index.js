const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require("cookie-parser");
const session = require('express-session')
const passport = require('passport')
const passportLocal = require('./config/passport-local')
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require('./config/middleware');

// const sassMiddleware = require('node-sass');



// app.use(sassMiddleware({
//     src: '/assets/sass/public',
//     dest: '/assets/css',
//     debug: true,
//     outputStyle: 'extended',
//     prefix: '/css'
// }))


app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
// make upload path availible to browser
app.use('/upload', express.static(__dirname + '/upload'));


app.use(expressLayouts);
// extract styles and script pages to layout
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)



//set up veiw engin
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: "ConnectMe",
    // todo change it
    secret: "0",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    // to store session cookie
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/ConnectMe_development" })
    

}));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use(customMware.setFlash);



// use express router
app.use("/", require("./routes/"))

app.listen(port, function(err){
    if (err){
        console.log('Error to connect server');
        
    }

    console.log(`server is running in port: ${port}`);
});
