console.log('test')


var map = L
    .map('mapid')
    .setView([41.8281, -87.6898], 12);   // center position + zoom

// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(map);

// Add a svg layer to the map
L.svg().addTo(map);

// Create data for circles:
var markers_obj = {};

d3.json('./trips.json', data => {

    const from_lat = data[0]['from_latitude'], from_long = data[0]['from_longitude']

    data.map(m => {
        if (markers_obj[m['to_station_id']]) {
            markers_obj[m['to_station_id']].count++
        } else {
            markers_obj[m['to_station_id']] = { long: parseFloat(m.to_longitude), lat: parseFloat(m.to_latitude), count: 1 }
        }
    })
    console.log(markers_obj)
    markers = []
    Object.keys(markers_obj).map(k => markers.push(markers_obj[k]))
    console.log(markers)

    // Select the svg area and add circles:
    d3.select("#mapid")
        .select("svg")
        .selectAll("myCircles")
        .data(markers)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            console.log(d)
            return map.latLngToLayerPoint([d.lat, d.long]).x
        }
        )
        .attr("cy", function (d) {
            return map.latLngToLayerPoint([d.lat, d.long]).y
        }
        )
        .attr("r", 5)
        .style("fill", "red")
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)

    d3.select("#mapid")
        .select("svg")
        .selectAll("myCircles")
        .data(markers.slice(0,1))
        .enter()
        .append("circle")
        .attr("cx", map.latLngToLayerPoint([from_lat, from_long]).x)
        .attr("cy", map.latLngToLayerPoint([from_lat, from_long]).y)
        .attr("r", 10)
        .style("fill", "blue")
        .attr("stroke", "blue")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)

    // Function that update circle position if something change
    function update() {
        d3.selectAll("circle")
            .attr("cx", function (d) { return map.latLngToLayerPoint([d.lat, d.long]).x })
            .attr("cy", function (d) { return map.latLngToLayerPoint([d.lat, d.long]).y })
    }

    // If the user change the map (zoom or drag), I update circle position:
    map.on("moveend", update)
})
