/*
 * Cookie stuff
 */

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";SameSite=Strict;";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

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
        window.location.href = shortcuts[event.key];
    }
  });
} addShortcuts();

/* Change logo to be top post from subreddit of choice */


var posts = null;

function getPosts() {
  var subreddit = "pixelart";
  var num = 5;
  var url = "https://www.reddit.com/r/" + subreddit + "/hot.json?limit=" + num;
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.onerror = function () {
    console.log(xhr.response);
      return;
  };

  xhr.onload = function () {
      dat = JSON.parse(xhr.response);
      posts = dat.data.children;
      changeLogo();
  };

  xhr.send();
} getPosts();


function changeLogo() {
  var ind = 0;
  var to_skip = getSkipPosts();

  // Only want sfw images that
  // aren't pinned and
  // haven't been skipped
  while (ind < posts.length &&
         (posts[ind].data.is_video ||
          posts[ind].data.is_gallery ||
          posts[ind].data.over_18 ||
          posts[ind].data.pinned ||
          posts[ind].data.stickied ||
          posts[ind].data.selftext != "" ||
          to_skip.includes(posts[ind].data.url)
         )) {
    ind++;
  }

  var logo = document.querySelector("#logo");
  var next = document.querySelector("#next");

  if (ind == posts.length) {
    logo.src = "content/images/logo.png";
    logo.onload = function () {
      logo.style["outline-width"] = "0vh";
      logo.parentNode.href = "";
      next.style["visibility"] = "hidden";
    };
    return; // no image found
  }

  console.log(posts[ind]);
  var img = posts[ind].data.url;
  // console.log(img);


  //console.log(logo);
  logo.src = img;

  // only want to add border once picture
  // has loaded
  logo.onload = function () {
    logo.style["outline-width"] = "0.5vh";
    logo.parentNode.href = img;
    next.style["visibility"] = "visible";
  };
}

function getSkipPosts() {
  return getCookie("skip").split(",,");
}

function setSkipPost(img) {
  var skips = getSkipPosts();
  skips.push(img);
  setCookie("skip", skips.join(",,"), 0.4);
}

function nextImage() {
  var logo = document.querySelector("#logo");
  var img = logo.src;
  setSkipPost(img);
  changeLogo();
} document.querySelector("#next a").onclick = nextImage;

function resetSkipCookie() {
  setCookie("skip", "", 0.4);
}


