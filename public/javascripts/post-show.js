// mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
var map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: post.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

// Add marker to map
var marker1 = new mapboxgl.Marker()
    .setLngLat(post.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
    .addTo(map);