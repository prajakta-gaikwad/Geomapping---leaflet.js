// URLs of the geojson data from usgs website and Tectonic plates
var earthquakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var tectonicPlatesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Performing a GET request to the earthquake query URL
d3.json(earthquakeLink, function (data) {
    // sending the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // GeoJSON objects are added to the map through a GeoJSON layer.
    // Creating a GeoJSON layer with the features array of GeoJSON object passed in
    // The onEachFeature option is a function that gets called on each feature before adding it to a GeoJSON layer

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },
        // pointToLayer - points are handled differently than polylines & polygons
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                fillOpacity: 0.5,
                stroke: true,
                color: "white",
                weight: 0.5
            })
        }
    });

    //sending created GeoJSON layer to the createMap function
    createMap(earthquakes)
}

function createMap(earthquakes) {
    // Define Map Layers
    var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    //There are two types of layers: 
    // (1) base layers that are mutually exclusive (only one can be visible on your map at a time), e.g. tile layers,
    // (2) overlays, which are all the other stuff you put over the base layers. 
    // In this example, we want to have 2 base layers to switch between, and 2 overlays to switch on and off: the earthquakes data and tectonic plates data.

    // Base layers

    var baseMaps = {
        "Street Map": streetMap,
        "Dark Map": darkMap,
    };

    // tectonic plate layer
    var tectonicPlates = new L.LayerGroup();

    // Overlay layers

    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // initializing the map on the set ID of our div element where we want our map
    // setting its view to Istanbul' geographical coordinates and a desired zoom level:
    var myMap = L.map('map', {
        center: [7.8626845, 29.6949232],
        zoom: 2.5,
        layers: [darkMap, earthquakes, tectonicPlates]
    });

    d3.json(tectonicPlatesLink, function(plates) {
        L.geoJSON(plates, {
            color: "orange",
            weight: 3
        })
        .addTo(tectonicPlates);
    });

    // Creating a layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Creating a legend
    var legend = L.control({position: 'topright'});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
                  grades = [1, 2, 3, 4, 5],
                  labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
}

function getColor(mag) {
    var color = "";
    if (mag > 5) {
        color = "red";
    }
    else if (mag > 4) {
        color = "darkorange";
    }
    else if (mag > 3) {
        color = "yellow";
    }
    else if (mag > 2) {
        color = "lightgreen";
    }
    else {
        color = "lightblue";
    }
    return color;
}

function getRadius(mag) {
    return mag*60000
}

