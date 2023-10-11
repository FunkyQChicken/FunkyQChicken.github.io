/*
 * Cookie stuff
 */

function setCookie(cname, cvalue) {
  localStorage.setItem(cname, cvalue);
}

function getCookie(cname) {
  var ret = localStorage.getItem(cname)
  if (ret === null) {
    ret = "";
  }
  return ret;
}

/*
  Date and Time
*/

updateTime();
updateDate();
setInterval(updateTime, 10000);

function updateTime() {
  let now = new Date();
  let m = now.getMinutes().toString();
  let h = now.getHours().toString();

  var dd = "am";
  var hh = h;

  if (m.length === 1) m = "0" + m;
  if (h.length === 1) h = "0" + h;

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
  let y = now.getFullYear();
  let w = now.getMonth();

  if (d.length === 1) d = "0" + d;
  if (y.length === 1) y = "0" + y;

  let output = d + " " + months[w] + " " + y;

  document.getElementById("date").innerHTML = output;
}


/* Change logo to be top post from subreddit of choice */


var posts = null;
var def_logo_chance = 0.20
function getPosts() {
  if (Math.random() < def_logo_chance)
    return;

  var subreddit = "pixelart";
  var num = 5;
  var url = "https://www.reddit.com/r/" + subreddit + "/hot.json?limit=" + num;
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.onerror = function() {
    console.log(xhr.response);
    return;
  };

  xhr.onload = function() {
    dat = JSON.parse(xhr.response);
    posts = dat.data.children;
    changeLogo();
  };

  xhr.send();
}
getPosts();


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
    logo.onload = function() {
      logo.style["outline-width"] = "0vh";
      logo.parentNode.href = "";
      next.style["visibility"] = "hidden";
    };
    return; // no image found
  }

  var img = posts[ind].data.url;
  logo.src = img;

  // only want to add border once picture
  // has loaded
  logo.onload = function() {
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
  // we don't want posts to build up, so remove old ones.
  if (skips.length > 12) {
    skips.splice(0, 5);
  }
  skips.push(img);
  setCookie("skip", skips.join(",,"), 0.4);
}

function nextImage() {
  var logo = document.querySelector("#logo");
  var img = logo.src;
  setSkipPost(img);
  changeLogo();
}
document.querySelector("#next a").onclick = nextImage;

function resetSkipCookie() {
  setCookie("skip", "", 0.4);
}


