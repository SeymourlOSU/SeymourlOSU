var mymap = L.map('map', {center: [50.13, -119.93], zoom: 3});
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.jpg', {
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true, //support Retina Display if the client uses high resolution monitor.
    attribution: 'Airport Data &copy; Map Cruzin | United States &copy; Oregon Explorer | Base Map &copy; CartoDB'
}).addTo(mymap);
    var colors = chroma.scale('Set1').mode('lch').colors(9);
    for (i = 0; i < 2; i++) {
        $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
    }
    // Get GeoJSON and put on it on the map when it loads
    L.geoJson.ajax("assets/airports.geojson", {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.AIRPT_NAME);
        },
        pointToLayer: function (feature, latlng) {
            var id = 0;
            if (feature.properties.CNTL_TWR == "Y") { id = 0; }
            else { id = 2;} //
            return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
        }
    }).addTo(mymap);
    // Set function for color.md ramp
    colors = chroma.scale('PuBu').mode('hsl').colors(5); //colors = chroma.scale('PuBu').colors(5);
    function setColor(density) {
        var id = 0;
        if (density > 50) { id = 4; }
        else if (density > 25 && density <= 50) { id = 3; }
        else if (density > 15 && density <= 25) { id = 2; }
        else if (density > 10 &&  density <= 15) { id = 1; }
        else  { id = 0; }
        return colors[id];
    }
    // Set style function that sets fill color.md property equal to airport density
    function style(feature) {
        return {
            fillColor: setColor(feature.properties.count),
            fillOpacity: 0.4,
            weight: 2,
            opacity: 1,
            color: '#ffffff',
            dashArray: '4'
        };
    }
    // Add state polygons
    L.geoJson.ajax("assets/us-states.geojson", {
        style: style
    }).addTo(mymap);
// Create Leaflet Control Object for Legend
var legend = L.control({position: 'bottomleft'});
// Function that runs when legend is added to map
legend.onAdd = function () {
    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b># of airports</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>50+</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>26-50</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>16-25</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 11-15</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-10</p>';
    div.innerHTML += '<hr><b>Control Tower<b><br />';
    div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p>Has Control Tower</p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p>No Control Tower</p>';
    // Return the Legend div containing the HTML content
    return div;
};
// Add a scale bar to map
L.control.scale({position: 'topleft'}).addTo(mymap);
// Add a legend to map
legend.addTo(mymap);
function myFunction() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "search");
    document.body.appendChild(x);
}
