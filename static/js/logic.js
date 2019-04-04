// Creating map object
// center on US
let map = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
  });

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={key}", {
  id: "mapbox.streets",
  key: API_KEY
}).addTo(map);

// going to create a function to color based on magnitude
// classified by typical descriptor values
function chooseColor(magnitude) {
    if (magnitude > 7.9) {
        return '#3f0000';
    }else if (magnitude > 6.9) {
        return '#580000';
    }else if (magnitude > 5.9) {
        return '#720000';
    }else if (magnitude > 4.9) { 
        return '#8b0000';
    }else if (magnitude > 3.9) {
        return '#a50000';
    }else if (magnitude > 2.9) {
        return '#be0000';
    }else if (magnitude > 1.9) {
        return '#d80000';
    }else{
        return '#e34c4c';
    }
}

// create popup function
let getPopup = function(feature, layer) {
    let content = `<h1>${feature.properties.place}</h1><hr>Magnitude ${feature.properties.mag}`;
    layer.bindPopup(content);
}

// create marker styling
let geoMarkStyle = function(feature) {
    return {
        radius: 7 * feature.properties.mag,
        fillColor: chooseColor(feature.properties.mag),
        color: 'black',
        weight: 1,
        fillOpacity: 0.75
    }
}

// get GeoJSON
d3.json(url, function(data) {
    // create a GeoJSON layer with the data
    L.geoJson(data, {
        // style each feature
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, geoMarkStyle(feature))
        },
        // call for each feature
        onEachFeature: function(feature, layer) {
            getPopup(feature, layer);
        }
    }).addTo(map);
    // create legend
    // first make a few arrays to make it easier
    let limits = [0, 1.9, 2.9, 3.9, 4.9, 5.9, 6.9, 7.9];
    let colors = ['#e34c4c', '#d80000', '#be0000', '#a50000', '#8b0000', '#720000', '#580000', '#3f0000'];

    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        //create div
        let div = L.DomUtil.create("div", "info legend");
        let labels = [];

        // create min/max
        let legendInfo = "<h2>Earthquake Magnitude</h2>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(map);
});
