var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://black:asrkpvg7@node.creta.work:30042/report';
var db;
MongoClient.connect(url, {
        // "username": "black",
        // "password": "asrkpvg7",
        authSource: "admin",
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, client) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);
        db = client.db('report');
    }
});
var port = 3000;
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res)=>{
    res.render("index");
})
app.post("/getcode", (req, res)=>{
    if(db){
        var collection = db.collection('productbarcodes');
        collection.find({"code": {'$regex': '.*' + req.body.code + '.*'}}).toArray(function(e, r){
            res.send({
                message: "OK",
                data: r
            });
        });
    } else {
        res.send({
            message: "DB not ready"
        })
    }
});
app.post("/query", (req, res)=>{

})

app.listen(port, () => {
    console.log(`Server ${process.env.APP_NAME || "Noname"} ${port}`)
})