/* exported addMap */
/*eslint-disable no-unused-vars */
"use strict";

var map;

function uuid() {
  // Generate a somewhat unique uuid
  var text = ("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx")
        .replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0;
          var v = c === "x" ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
  return text;
}

function addMap() {
  // better background map
  var token = "pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA";
  L.mapbox.accessToken = "pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA";

  map = L.mapbox.map("map", "siggyf.c74e2e04");
  console.log("map", map);

  // map = L.map("map");
  var points = [[52.931, 4.651], [53.540, 6.446]];
  var bounds = L.latLngBounds(points);
  console.log("Set initial view to [" + bounds.getCenter().lat + ", " + bounds.getCenter().lng + "]");
  map.fitBounds(bounds);
  // L.tileLayer(
  //     "https://api.mapbox.com/v4/{mapid}/{z}/{x}/{y}.{format}?access_token={token}",
  //     {
  //         attribution: "&copy; <a href="http://www.openstreetmap.org/copyright">OSM</a>, &copy; <a href="http://cartodb.com/attributions">mapbox</a>",
  //         token: token,
  //         format: "png",
  //         mapid: "mapbox.dark"
  //     }
  // ).addTo(map);
  map.properties = {
    editing: false,
    deleting: false
  };

  if (!L.Icon.Default.imagePath) {
    // if the icon path is not defined it"s probably here....
    L.Icon.Default.imagePath = "styles/images";
  }
}
