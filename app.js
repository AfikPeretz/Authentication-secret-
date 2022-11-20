//jshint esversion:6
require ('dotenv').config();
const express = require('express');
const bodyParser = require ('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    userName: {type : String , unique : true},
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);


app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    const userName = req.body.username;
    const password = req.body.password;
    const user = new User({
        userName: userName,
        password: password
    });
    user.save(function(err){
        if (err){
            res.send(err);
        } else {
            res.redirect('/login');
        }
    });
});

app.post('/login', function(req, res){
    User.findOne({userName: req.body.username}, function(err, result){
        if (!err){
            if (result){
                if (result.password === req.body.password){
                    res.render('secrets');
                } else {
                    res.send("Wrong password, try again!");
                    res.redirect('/login');
                }
            }
            else{
                res.send("There is no such user");
            }
        } else {
            res.send(err);
        }
    });
});




app.listen(3000, function() {
    console.log("Server started on port 3000");
});