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
	
	let months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

	let now = new Date();
	let d = now.getDate();
	let m = now.getMonth();
	let y = now.getFullYear();
	let w = now.getMonth();

	if (d.length === 1) d = "0"+d;
	//if (m.length === 1) m = "0"+m;
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




/* Add keyboard shortcuts for links */

function addShortcuts() {
  // extend as needed
  var shortcut_order = ['a', 's', 'd', 'f', 'j', 'k', 'l', 'g', 'h', 'q', 'w',  'e', 'r', 't', 'u', 'i', 'o', 
    'p', 'v', 'n', 'z', 'x', 'c', 'm', 'b', 'y', ';', '\'', ',', '.', '/', '[', '1', '2', 
    '3', '4', '5', '6', '7', '8', '9', '0'] 


  var links = document.querySelectorAll(".links a")
  var shortcuts = {}

  for (var i = 0; i < links.length; i++) {
    node = links[i]
    key = shortcut_order[i]

    node.text = key + ": " + node.text
    shortcuts[key] = node.href
  }

  document.addEventListener('keydown', function(event) {
    // only want to use shortcuts when not using *other* shortcuts
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return;
    }
    if (event.key in shortcuts) {
      window.location.href = shortcuts[event.key]
    }
  });
} addShortcuts();

/* Change logo to be top post from subreddit of choice */
/**
 * Reddit API wrapper for the browser (https://git.io/Mw39VQ)
 * @author Sahil Muthoo <sahil.muthoo@gmail.com> (https://www.sahilm.com)
 * @license MIT
 */

function changeLogo() {
  var subreddit = "pixelart";
  var num = 5;
  var url = "https://www.reddit.com/r/" + subreddit + "/hot.json?limit=" + num;
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.onerror = function () {
    console.log(xhr.response);
    return 
  };

  xhr.onload = function () {
    dat = JSON.parse(xhr.response);
    dat = dat.data.children

    var ind = 0;
    while (ind < num && 
       (dat[ind].data.is_video || 
        dat[ind].data.is_gallery ||
        (dat[ind].data.selftext != "")
        )) {
      ind++;
    }

    if (ind == num) {
      return; // no image found
    }
    console.log(dat[ind]);
    var img = dat[ind].data.url;
    console.log(img);

    logo = document.querySelector("#logo");
    logo.src = img;

    // only want to add border once picture
    // has loaded
    logo.onload = function () {
      logo.style["outline-width"] = "0.5vh";
    };
  };
  xhr.send();
} changeLogo();

