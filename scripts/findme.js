// JavaScript source code
$(document).ready(function () {
    $.loader({
        className: "blue-with-image",
        content: ''
    });
});
google.maps.event.addDomListener(window, 'load', initialize);
var lat1;
var lat2 = getParameterByName("lat");
var lng1;
var lng2 = getParameterByName("lng");
var map;
function initialize() {
    InitSideBar();
    directionsService = new google.maps.DirectionsService();
    navigator.geolocation.getCurrentPosition(function (position) {
        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        lat1 = position.coords.latitude;
        lng1 = position.coords.longitude;
        directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
            center: { lat: lat1, lng: lng1 },
            zoom: 15
        };
        map = new google.maps.Map(document.getElementById('mapContainer'),
            mapOptions);
        directionsDisplay.setMap(map);
        calcRoute();
    });
}
$("#allRestaurantDv").click(function () {
    location.href = "home.html";
});

function panToMe() {

    var me = new google.maps.LatLng(lat1, lng2);
    map.panTo(me);
}
function calcRoute() {
    $.loader('close');
    start = new google.maps.LatLng(lat1, lng1);
    end = new google.maps.LatLng(lat2, lng2);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            panToMe();
        }
        else {
            console.debug(response);
        }
    });
}