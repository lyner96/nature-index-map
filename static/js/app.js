/* map layer */
var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    minZoom: 2,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

/* map initialization */
var latlng = L.latLng(4.701521035537492, 78.12125311257726);
var map = L.map('map', {
    center: latlng,
    zoom: 4,
    zoomControl: false,
    fullscreenControl: false,
    layers: [tiles]
});

/* define marker */
var markers = L.markerClusterGroup();

/* slider to show institution on map */
if ($('#myRange').val() == '0')
{
    $("#index").text('Slide to choose the index');
}

var index_range = ["Slide to choose the index", "1-100", "1-200", "1-300", "1-400", "1-500"]
var index_range_value = [0, 100, 200, 300, 400, 500]

$("#myRange").change(function(event) {
    var range = this.value

    switch(range)
    {
        case range:
            $("#index").text(index_range[range]);
            break;
    }

    index = index_range_value[range]

    $.ajax({
        url: '/show',
        type: 'POST',
        data: {'index': index}, 
        dataType: "json",
        success: function(map_data) {

            markers.clearLayers();

            for (var i = 0; i < map_data.length; i++) {
    
                var markerIcon = L.divIcon({
                    className: 'my-div-icon',
                    iconSize: [25, 41],
                    html: '<img src="static/images/marker-icon.png">'
                });
                
                content = "Institution: " + map_data[i].Institution + "<br>" + "Index: " + map_data[i].rank + "<br>" + "Country: " + map_data[i].Country; 

                var marker = L.marker(new L.LatLng(map_data[i].lat, map_data[i].lng), {
                    icon: markerIcon
                }).addTo(markers).bindPopup(content, {maxWidth: 1000});

                marker.on('click', function(){
                    this.openPopup();
                });

                markers.addLayer(marker);
                map.addLayer(markers);
            }
        }
    });

    $.ajax({
        url: '/statistic',
        type: 'POST',
        data: {'index': index}, 
        dataType: "json",
        success: function(country_filtered) {

            for (var x = 1; x < 4; x++) {
                y = x - 1
                $("#country"+x+"_name").text(country_filtered[y].Country);
                $("#country"+x+"_count").text(country_filtered[y].rank);
            }
        }
    });
})