// JavaScript source code

var _facebookId;
var _fullName;
var currentUser = localStorage.getItem('userObject');
$(document).ready(function () {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});
function onDeviceReady() {
    if (!window.cordova) {
        facebookConnectPlugin.browserInit(525906100896967);
    } $('#loginDv').delay(500).fadeIn(500);
    console.log(currentUser);
    if (currentUser == null || typeof currentUser == undefined) {
    }
    else {
        navigateTo('home.html');
    }
}
function login() {
    facebookConnectPlugin.login(['email'], facebook_OnSuccess);
}
function facebook_OnSuccess(response) {
    var userFB = response.authResponse;
    console.log(response);
    if (response.status === 'connected') {
        // get info
        facebookConnectPlugin.api(userFB.userID + "/?fields=id,email,name", ["user_birthday"],
    function (result) {
        _facebookId = result.id;
        _fullName = result.name;
        _email = result.email;
        var _Url = APILink + '/api/Users/FaceBookLogin';
        var _Type = "post";
        var _Data = JSON.stringify({
            'FacebookId': _facebookId,
            'FullName': _fullName,
            'Email': _email
        });
        CallAPI(_Url, _Type, _Data, function (data) {
            if (data.Code == 100) {
                localStorage.setItem('userObject', JSON.stringify({
                    'Id': data.Data.Id,
                    'FullName': data.Data.FullName,
                    'Status': '0'
                }));
                navigateTo('home.html');
            }
            else {
                $('#dvMessage').addClass('show').removeClass('hidden');
            }
        }, false);
    },
    function (error) {
        //alert("Failed: " + error);
    });
    }
    else {
        console.log('Facebook login failed: ' + response.error);
    }
}
function guestLogin() {
    localStorage.setItem('userObject', JSON.stringify({
        'Id': '',
        'FullName': '',
        'Status': '0'
    }));
    navigateTo('home.html');
}
