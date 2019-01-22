const express = require('express');
const app = express();
const server = require('http').Server(app);
const dashboardRouter = require('./api/dashboard/index');
const path = require('path');


// request body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Startup database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://botCommander:botcommander1234@ds157522.mlab.com:57522/bot-commander',{ useNewUrlParser: true});

// project temps
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'./public')));
app.set("views",'./views');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });


//routers
app.use('/dashboard',dashboardRouter);


// app configuration
var port = process.env.PORT || 9000;
server.listen(port,()=>{
    console.log("server  on");
});


