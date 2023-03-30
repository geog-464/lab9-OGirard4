// declare the map variable here to give it a global scope
let myMap;

// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', 
	{
		attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}
)
const OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', 
{
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});


//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
let baseLayers = { 
	"CartoDB": CartoDB_Positron
	//,...
};

function initialize(){
    loadMap();
};

function loadMap(mapid){
	//now reassign the map variable by actually making it a useful object, this will load your leaflet map
	try {
	myMap.remove()
} 	catch(e) {
	console.log(e)
	console.log("no map to delete")
} 	finally {
	//put your map loading code in here
		if (mapid == 'mapa'){
		myMap = L.map('mapdiv', {
			center: [45.50, -73.58]
			,zoom: 3
			,maxZoom: 18
			,minZoom: 3
			,layers: OpenStreetMap_HOT
	});
		fetchData("https://raw.githubusercontent.com/geog-464/geog-464.github.io/main/Amtrak_Stations.geojson")
		} else if (mapid == 'mapb'){
		myMap = L.map('mapdiv', {
			center: [45.50, -73.58]
			,zoom: 3
			,maxZoom: 18
			,minZoom: 3
			,layers: CartoDB_Positron
	})
		fetchData("https://raw.githubusercontent.com/geog-464/geog-464.github.io/main/megacities.geojson")	
	}}
};
function fetchData(e){
    //load the data
    fetch(e)
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer using the fetched json and add it to the map object
            L.geoJson(json,{style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap)
        })
};
function addPopups(feature, layer){
	layer.bindPopup(feature.properties.StationNam);
}
function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}

function styleAll(feature, latlng) {
	console.log(feature.properties.ZipCode)
	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#fff'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}
	if (typeof feature.properties.ZipCode == "string") {
		styles.fillColor = 'cyan'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9

	}


	return styles;
}
//window.onload = initialize();