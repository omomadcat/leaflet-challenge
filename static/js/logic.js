var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
 
            var markerSize = feature.properties.mag * 5;
            var markerColor = getColor(feature.geometry.coordinates[2]);
            
            return L.circleMarker(latlng, {
                radius: markerSize,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(
                `<b>Location:</b> ${feature.properties.place}<br>
                 <b>Magnitude:</b> ${feature.properties.mag}<br>
                 <b>Depth:</b> ${feature.geometry.coordinates[2]} km`
            );
        }
    }).addTo(map);

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [-10, 10, 30, 50, 70, 90];
        
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '10px';

        var labels = ['<strong>Depth</strong>'];
        depths.forEach(function(depth, i) {
            div.innerHTML += 
                `<i style="background:${getColor(depth + 1)}; width: 20px; height: 20px; display: inline-block; margin-right: 5px; border: 1px solid black"></i> 
                ${depth}${depths[i + 1] ? '&ndash;' + depths[i + 1] : '+'} km<br>`;
        });

        return div;
    };
    legend.addTo(map);
});

function getColor(depth) {

    if (depth > 90) return "maroon";
    if (depth > 70) return "red";
    if (depth > 50) return "orange";
    if (depth > 30) return "yellow";
    if (depth > 10) return "green";
    if (depth > -10) return "lime";
}
