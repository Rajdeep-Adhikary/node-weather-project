const weather = require('weather-js');
var weatherData = '';

weatherData = weather.find({search: 'Howrah, IN', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);

    return JSON.stringify(result, null, 2);
});



module.exports = weatherData;