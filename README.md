# Geomapping
This project is to build an interactive map to visualize  [USGS'](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) earthquake data using javascript's Leaflet.js library.

# Technologies used
* Leaflet.js
* HTML/CSS/Javascript
* Bootstrap

# Steps followed
#### Preparation steps - HTML
* Included leaflet css, js files in the head section
![4-scatter](preparation.PNG)
* Created a div element as a placeholder for the map
![4-scatter](body.PNG)

#### Javascript
* Used GeoJSON data [https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson (https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson)

* Created a map using Leaflet that plots all of the earthquakes from the data on their longitude and latitude
* Created data markers that reflect the magnitude of the earthquake in their size and color.

## Snapshot of the webpage

![4-scatter](webpage.png)
