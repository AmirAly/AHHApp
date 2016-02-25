// JavaScript source code
google.maps.event.addDomListener(window, 'load', initialize);
var map;
var myLocation;
var lat1;
var lng1;

function initialize() {
    InitSideBar();

    $.loader({
        className: "blue-with-image",
        content: ''
    });
    var myLatlng = new google.maps.LatLng(52.369983, 4.894827);
    var mapOptions = {
        zoom: 13,
        center: myLatlng,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById('mapContainer'),
        mapOptions);
    google.maps.event.addListenerOnce(map, 'idle', function () {
        $.loader("close");
        markResturants();
    });



}
$("#allRestaurantDv").click(function () {
    location.href = "home.html";
});
function markResturants() {
    var _Url = APILink + '/api/Restaurants/ListRestaurants';
    var _Type = "get";
    var _Data = { '_Index': 1000000, '_limit': 10, '_OrderBy': "Name", "_lat": 52.369983, "_lng": 4.894827 }; // AvgRate , Name ,Geolocation
    CallAPI(_Url, _Type, _Data, function (data) {
        if (data.Code == 100) {
            console.log(data.Data);
            $.each(data.Data, function (index, Restaurants) {
                
                var myLatlng = new google.maps.LatLng(Restaurants.lat, Restaurants.lng);
                var ArtworkCDN = "http://AHHAPI.deltacode.co/backend/images/";
                var hhIcon = ArtworkCDN + "red-dot.png";
                if (Restaurants.ToNextHour == "green") {
                    hhIcon = ArtworkCDN + "green-dot.png";
                }
                else if (Restaurants.ToNextHour == "yellow") {
                    hhIcon = ArtworkCDN + "yellow-dot.png";
                }
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    animation: google.maps.Animation.DROP,
                    title: Restaurants.Name,
                    icon: hhIcon,
                    map: map,
                });
                marker.addListener('click', function () {
                    location.href = "home.html?id=" + Restaurants.Id;
                });
            });
        }
    });
}

function showMyLocation() {

    var myLatlng;
    var hhIcon;

    InitSideBar();

    navigator.geolocation.getCurrentPosition(function (position) {
        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        lat1 = position.coords.latitude;
        lng1 = position.coords.longitude;

        myLatlng = new google.maps.LatLng(lat1, lng1);
        //https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/128/gps_device.png
        var marker = new google.maps.Marker({
            position: myLatlng,
            animation: google.maps.Animation.DROP,
            icon: "http://ahhapi.deltacode.co/images/me.png",
            map: map
        });
        map.panTo(myLatlng);
    });
}