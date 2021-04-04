mapboxgl.accessToken = 'pk.eyJ1IjoiYWNrZDE1MSIsImEiOiJja2xpbHFoN3EwOWZ4MndwYTJvbXFqNmV1In0.FN9CJbzwBOpKl4sIScSTKA';
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

// Toggle edit review form
$('.toggle-edit-form').on('click', function() {
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
    $(this).siblings('.edit-review-form').toggle();
});