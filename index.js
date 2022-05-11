const express = require('express');
const app = express();
const path = require('path');
const route = require('./modules/routes');
const weatherData = require('./modules/weather');
// const weather = require('./modules/weather');
const weather = require('weather-js');
const mysql = require('mysql');
const bodyParser = require('body-parser');

var urlEncodedParser = bodyParser.urlencoded({extended:false});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// setting path for static assets
app.use(express.static('./assets'));


app.post('getWeather/', function (req, res) {
    console.log(req.query);
})

// getting request and setting route directions
app.get('*', function (req,res) {
    const requestedURL = req.url;
    const trimmedURL = req.url.substring(1, requestedURL.length);
    const fileName = route[trimmedURL];
    if(typeof(fileName) === 'undefined'){
        res.status(200).sendFile(path.resolve(__dirname, './pages/notFound.html'));
    }
    else{
        res.status(200).sendFile(path.resolve(__dirname, fileName));
    }
});



app.post('/getWeatherData', function (req, res) {
    const weatherData = weather.find({search: 'Howrah, IN', degreeType: 'C'}, function(err, result) {
        if(err) console.log(err);
    
        res.json(result);
    });
})

app.post('/getWeather', function (req, res) {
    var location = req.query.location;
    const weatherData = weather.find({search: location, degreeType: 'C'}, function(err, result) {
        if(err) console.log(err);
    
        res.json(result);
    });
})

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1704",
    database: "node"
});

app.post('/registration', urlEncodedParser, (req, res) =>{
    var user = {
        first_name : req.body.fname,
        last_name : req.body.lname,
        email : req.body.email,
        password : req.body.password
    };

    con.connect(function (err) {
        if(err) throw err;
        console.log('Connected');
        var query = `INSERT INTO weather_users(first_name, last_name, email, password) VALUES('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}')`;

        con.query(query, function (err, result) {
            if(err) throw err;
            if (result.affectedRows > 0) {
                res.status(200).sendFile(path.resolve(__dirname, './pages/login.html'));
            }
            else{
                res.status(200).sendFile(path.resolve(__dirname, './pages/error.html'));
            }
        })
    })
    con.end();
    
})


app.post('/checkLogin', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    var getQuery = `SELECT * FROM weather_users WHERE email = '${email}' AND password = '${password}'`;

    con.query(getQuery, function (err, result) {
        res.json(result);
    })
})



app.listen(3000, function() {
    console.log('Server is listening on port 3000');
});


