// Create our initial map object
var myMap = L.map("map", {
  center: [39.82, -98.57],
  zoom: 3.75
});

// Add a tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Create a function to set marker color per magnitude
function circleColor(magnitude) {
  if (magnitude < 1) {
      return "#74F30F";
  } else if (magnitude < 2) {
      return "#DFF492";
  } else if (magnitude < 3) {
      return "#FDE280";
  } else if (magnitude < 4) {
      return "#F5B846";
  } else if (magnitude < 5) {
      return "#F59846";
  } else {
      return "#F53B19";
  };
}

// Create a function to set marker radius per magnitude
function circleSize(magnitude) {
  return magnitude * 15000;
}

// URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Plot the earthquake markers on the map
d3.json(url, function(data) {

  var earthquakeData = data.features;

  for (var i = 0; i < earthquakeData.length; i++) {
    var earthquake = earthquakeData[i];

    var marker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      radius: circleSize(earthquake.properties.mag),
      fillColor: circleColor(earthquake.properties.mag),
      fillOpacity: 0.9,
      stroke: false,
    }).bindPopup("<h3>" + earthquake.properties.place +
      "</h3><hr><div> <b>Magnitude: </b> " + earthquake.properties.mag + "<br><b>Date: </b> " + new Date(earthquake.properties.time) + "</div>");

    // Add the marker to the map
    marker.addTo(myMap)
  };  
});

// Create a legend for the map
var legend = L.control({
  position: "bottomright" 
});

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var mags = [0, 1, 2, 3, 4, 5]

  for (var i = 0; i < mags.length; i++) {
    div.innerHTML +=
    '<i style="background:' + circleColor(mags[i] + 1) + '"></i> ' + 
    + mags[i] + (mags[i + 1] ? ' - ' + mags[i + 1] + '<br>' : ' + ');
  }

return div;
};

legend.addTo(myMap);

