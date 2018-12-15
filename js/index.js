/*
	Date and Time
*/

updateTime();
updateDate();
setInterval(updateTime, 1000);

function updateTime() {
	let now = new Date();
	let m = now.getMinutes().toString();
	let h = now.getHours().toString();
	
	var dd = "am";
	var hh = h;

	if (m.length === 1) m = "0"+m;
	if (h.length === 1) h = "0"+h;
	
	if (h >= 12) {
		h = hh - 12;
		dd = "pm";
	}
	if (h == 0) {
		h = 12;
	}

	let output = h + ":" + m + " " + dd;

	document.getElementById("current-time").innerHTML = output;
}

function updateDate() {
	
	let months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "nov", "dec"];

	let now = new Date();
	let d = now.getDate();
	let m = now.getMonth()+1;
	let y = now.getFullYear();
	let w = now.getMonth();

	if (d.length === 1) d = "0"+d;
	if (m.length === 1) m = "0"+m;
	if (y.length === 1) y = "0"+y;
	
	let output = d + " " + months[w] + " " + y;

	document.getElementById("date").innerHTML = output;
}

/*
	Weather
*/

setInterval(getLocationAndWeather, 180000)

var weatherData = {
	city: document.querySelector ("#city"),
	weather: document.querySelector ("#weather"),
	temperature: document.querySelector("#temperature"),
	temperatureValue: 0,
	units: "°F"
};

function roundTemperature(temperature){
	temperature = temperature.toFixed(1);
	return temperature;
}

function getLocationAndWeather(){
	if (window.XMLHttpRequest){
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", function() {
		var response = JSON.parse(xhr.responseText);

		console.log(response);
		var position = {
			latitude: response.latitude,
			longitude: response.longitude
		};
		var cityName = response.city;

		var weatherSimpleDescription = response.weather.simple;
		var weatherDescription = response.weather.description;
		var weatherTemperature = roundTemperature(response.weather.temperature * 9/5 + 32);

		weatherData.temperatureValue = weatherTemperature;

		weatherData.city.innerHTML = cityName;
		weatherData.weather.innerHTML =  weatherDescription;
		weatherData.temperature.innerHTML = weatherTemperature + weatherData.units;
	}, false);

	xhr.addEventListener("error", function(err){
		alert("Could not complete the request");
	}, false);

	xhr.open("GET", "https://fourtonfish.com/tutorials/weather-web-app/getlocationandweather.php?owapikey=e2db5b0453a25a492e87ad8b03046a7c&units=metric", true);
	xhr.send();
	} else {
		alert("Unable to fetch the location and weather data.");
	}
} getLocationAndWeather();


/* Fix for Android keycode 229 issue */
var prevWord = "";
function isBackspace(val) {
	var bool = val && val.length < prevWord.length;
	prevWord = val;
	return bool;
}

help.innerHTML = "";
for (var i = 0; i < commands.length; i++) {
	var command = commands[i];
	if (command.command.length > 0) {
		help.innerHTML += "<li><span><span class='icon " + command.icon + "'></span><span class='command'>" + command.command + "</span></span></li>";
	}
}

