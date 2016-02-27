$("#allRestaurantDv").click(function () {
    $('.dvProfile').fadeOut(200, function () {
        $('.dvHome').show();
    });
});
$(".sortable").click(function () {
    $('.dvHome').fadeOut(200, function () {
        $('.dvProfile').removeClass("hidden");
        $('.dvProfile').show();
    });
})
$(".glyBack").click(function () {
    $('.dvProfile').fadeOut(200, function () {
        $('.dvHome').show();
    });
    Init(false);
});
var restaurantId;
var GPS = false;
// Listen for resize changes
function checkWindowSize() {
    var dvHeight = window.innerHeight;
    if (dvHeight >= 768) {
        $('.dvScroll').attr('style', 'max-height: ' + dvHeight * 2 / 3 + 'px;');
    }
    else if (dvHeight >= 480) {
        $('.dvScroll').attr('style', 'max-height: ' + dvHeight * 1 / 3 + 'px;');
    }
    else if (dvHeight >= 320) {
        $('.dvScroll').attr('style', 'max-height: ' + dvHeight * 1 / 5 + 'px;');
    }
    else {
        $('.dvScroll').attr('style', 'max-height: ' + dvHeight * 1 / 4 + 'px;');
    }
}

window.addEventListener("resize", function () {
    // Get screen size (inner/outerWidth, inner/outerHeight)
    checkWindowSize();

}, false);

$(document).ready(function () {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", Init(true), false);
    } else {
        Init(true);
    }
    checkWindowSize();
});

function Init(checkParam) {
    var Id = getParameterByName("id");
    if (Id != "" && checkParam == true) {
        showRestaurant(Id);
        return;
    }
    loadAllRestaurants(0, 0);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            alert('GEO');
            GPS = true;
            loadAllRestaurants(pos.coords.latitude, pos.coords.longitude);
        }, function (err) {
            loadAllRestaurants(0, 0);
        });
    } else {
        loadAllRestaurants(0, 0);
    }
}
function TourNow() {
    var NewAgemt = localStorage.getItem('tour');
    if (NewAgemt == null || typeof (NewAgemt) == undefined) {
        localStorage.setItem('tour', true);
        var tour = new Tour({
            steps: [
            {
                placement: "top",
                element: "#allRestaurantDv",
                title: "We are here",
                content: "Tap the cocktail glass, from anywhere, to view the list of bars."
            },
            {
                placement: "top",
                element: "#locationDv",
                title: "Locate",
                content: "Tap here to locate Amsterdam's drink specials!"
            },
            {
                placement: "bottom",
                element: "#dvSorting",
                title: "Sorting !",
                content: " You can arrange this list by rating, distance from your location and specials available now!"
            },
            {
                placement: "top",
                element: ".adjustRestaurant:first",
                title: "Enjoy",
                content: " It's time for a drink! Select a bar and enjoy Amsterdam!"
            }
            ],
            backdrop: false,
        });
        tour.init();
        tour.start();
    }
}
function loadAllRestaurants(_lat, _lng) {
    var _Url = APILink + '/api/Restaurants/ListRestaurants';
    var _Type = "get";
    var _Data = { '_Index': 1000000, '_limit': 100, '_OrderBy': "Name", "_lat": _lat, "_lng": _lng }; // AvgRate , Name ,Geolocation
    CallAPI(_Url, _Type, _Data, function (data) {
        InitSideBar();
        if (data.Code == 100) {
            $('#dvSort').empty();
            $.each(data.Data, function (index, Restaurants) {
                console.log(Restaurants);
                var distance = "";
                var distkm = Restaurants.CurrentDistance / 1000;
                if (Restaurants.CurrentDistance > 1000)
                    distance = "About " + Math.round(distkm) + " KM";
                else
                    distance = Math.round(Restaurants.CurrentDistance) + " M";
                var light = "NotNow";
                var order = 3;
                if (Restaurants.ToNextHour == "green") {
                    light = "Open";
                    order = 1;
                }
                else if (Restaurants.ToNextHour == "yellow") {
                    light = "Soon";
                    order = 2;
                }

                $('#dvSort').append('<div class="col-md-12 col-sm-12 col-xs-12 adjustRestaurant sortable" \
                    data-gps-sorting="' + Restaurants.CurrentDistance + '"\
                    data-name-sorting="' + index + '" \
                    data-hh-sorting="' + order + '" \
                    data-rate-sorting="' + Restaurants.AvgRate + '" \
                    onclick="showRestaurant(' + Restaurants.Id + ')">\
                            <!--two lines-->\
                            <div class="col-md-6 col-sm-6 col-xs-6 text-left">\
                                <span class="fa fa-circle '+ light + '"></span>\
                                <span class="restaurantName">  ' + Restaurants.Name + '</span>\
                                <br />\
                                <span id="descreption' + Restaurants.Id + '" class="restaurantDescription">    ' + distance + '</span>\
                            </div>\
                            <!--rating-->\
                            <div class="col-md-6 col-sm-6 col-xs-6 resturantRating">\
                                <span id="star1'+ Restaurants.Id + '" class="glyphicon glyphicon-star-empty lightGray"></span>\
                                <span id="star2' + Restaurants.Id + '" class="glyphicon glyphicon-star-empty lightGray"></span>\
                                <span id="star3' + Restaurants.Id + '" class="glyphicon glyphicon-star-empty lightGray"></span>\
                                <span id="star4' + Restaurants.Id + '" class="glyphicon glyphicon-star-empty lightGray"></span>\
                                <span id="star5' + Restaurants.Id + '" class="glyphicon glyphicon-star-empty lightGray"></span>\
                            </div>\
                        </div>');
                if (Restaurants.AvgRate != null || Restaurants.AvgRate != 0) {
                    //for (var i = 0; i < Restaurants.AvgRate; i++) {
                    //    var increase = i + 1;
                    //    $('#star' + increase + Restaurants.Id).removeClass('glyphicon-star-empty lightGray').addClass('glyphicon-star yellowStar');
                    //}
                    for (var i = 1; i <= Restaurants.AvgRate; i++) {
                        $('#star' + +i + Restaurants.Id).removeClass('glyphicon-star-empty lightGray').addClass('glyphicon-star yellowStar');
                        if (i + .5 == Restaurants.AvgRate) {
                            var next = i + 1;
                            $('#star' + next + Restaurants.Id).removeClass('glyphicon glyphicon-star-empty lightGray').html('<img src="images/half.png" class="half" />');
                        }
                    }
                }

                var string = $('#descreption' + Restaurants.Id).text();
                var substr = string.substr(0, 20);
                $('#descreption' + Restaurants.Id).text(substr);
            });
            sortAscendeing('sortable', 'hh-sorting', 'dvSort')
            if (_lat == 0 && _lng == 0) {
                $(".restaurantDescription").text("Loading location services");
            }
            TourNow();
        }
        else {
            console.log(data);
        }
    }, false);
}
function showRestaurant(id) {
    if (currentUser == null || currentUser.Id == "" || currentUser.Id == 0 || currentUser.Status == 1) {
        $('#dvActions').hide();
    }
    $('#rating-input').rating({
        min: 0,
        max: 5,
        step: 1,
        size: 'xs',
        showClear: false
    });

    restaurantId = id;
    $('.caption').hide();
    if (id != "") {
        var _Url = APILink + '/api/Restaurants/ViewRestaurant';
        var _Type = "get";
        var _Data = { '_Id': restaurantId };
        CallAPI(_Url, _Type, _Data, function (data) {
            if (data.Code >= 100) {
                if (data.Data.ToNextHour == "green") {
                    $('#imgGreen').attr('src', 'images/green.png');
                }
                else if (data.Data.ToNextHour == "yellow") {
                    $('#imgGreen').attr('src', 'images/yellow.png');
                }
                else {
                    $('#imgGreen').attr('src', 'images/red.png');
                }
                $('#spnRestaurantName').text("");
                $('#h4RestaurantName').text("");
                if (data.Data.Name != null) {
                    $('#spnRestaurantName').text(data.Data.Name);
                    $('#h4RestaurantName').text(data.Data.Name);
                }
                $('#spnRestaurantAddress').text("");
                if (data.Data.Address != null) {
                    $('#spnRestaurantAddress').text(data.Data.Address);
                }
                if (GPS == true) {
                    $('#pGPS').remove();
                    $('#lnkFindRestaurant').attr('href', 'javascript:navigateTo(\'findme.html?restaurantId=' + data.Data.Id + '&lat=' + data.Data.lat + '&lng=' + data.Data.lng + '\')');
                }
                else {
                    $('#lnkFindRestaurant').attr('disabled', 'disabled');
                    $('#pGPS').remove();
                    $('#lnkFindRestaurant').after('<p id="pGPS" class="smallFont">Loading location services</p>');
                }
                $('#lnkWebsite').hide();
                if (data.Data.WebsiteLink != null) {
                    $('#lnkWebsite').text(data.Data.WebsiteLink);
                    $('#lnkWebsite').prop('href', data.Data.WebsiteLink);
                    $('#lnkWebsite').show();
                }
                if (data.Data.AvgRate != null || data.Data.AvgRate != 0) {
                    resetAvgRate();
                    for (var i = 1; i <= data.Data.AvgRate; i++) {
                        $('#star' + i).removeClass('glyphicon-star-empty lightGray').addClass('glyphicon-star yellowStar');
                        if (i + .5 == data.Data.AvgRate) {
                            var next = i + 1;
                            $('#star' + next).removeClass('glyphicon glyphicon-star-empty lightGray').html('<img src="images/half.png" class="half2" />');
                        }
                    }
                }
                $('#spnRestaurantAbout').text("");
                if (data.Data.About != null) {
                    $('#spnRestaurantAbout').text(data.Data.About);
                }
                $('#imgRestaurant').prop('src', 'images/unknown.png');
                $('#imgModalRestaurent').prop('src', 'images/unknown.png');
                if (data.Data.Logo != null) {
                    $('#imgRestaurant').prop('src', data.Data.Logo);
                    $('#imgModalRestaurent').prop('src', data.Data.Logo);
                }
                $('#spnHappyHour').text("");
                //if (data.Data.ToNextHourReview != null && data.Data.ToNextHourReview != "") {
                    for (var i = 0 ; i < data.Data.NextHappyHour.length; i++) {
                        $('#spnHappyHour').append(
                            "<p>" + data.Data.NextHappyHour[i].HourStart.split(':')[0] + ":" + data.Data.NextHappyHour[i].HourStart.split(':')[1] +
                            " to " + data.Data.NextHappyHour[i].HourEnd.split(':')[0] + ":" + data.Data.NextHappyHour[i].HourEnd.split(':')[1] +
                            " - " + data.Data.NextHappyHour[i].Descreption +
                            "</p>"
                            );
                    }
                //}
                if (data.Data.FaceBookLink != null) {
                    $('#lnkFacebookPage').show();
                    $('#lnkFacebookPage').prop('href', data.Data.FaceBookLink);
                }
                if (data.Data.FaceBookLink == null) {
                    $('#lnkFacebookPage').hide();
                }
                if (typeof currentUser != undefined && currentUser != null && currentUser.Id != "") {
                    resetUserRate(currentUser.Id);

                    $('#rating-input').rating('update', 0);
                    $('#dvAllReviews').empty();
                    $.each(data.Data.Reviews, function (index, comments) {
                        if (comments.Users.Id == currentUser.Id && comments.Rate != 0) {
                            // initiate the rate plugin with user's previous rate if exists
                            $('#rating-input').rating('update', comments.Rate);
                        }
                        var review = comments.Review;
                        if (review == null) {
                            review = "";
                        }
                        $('#dvAllReviews').append('<div class="col-md-12 col-sm-12 col-xs-12 adjusrReviews">\
                                    <div class="col-md-3 col-sm-3 col-xs-4 adjustUserInfo">\
                                        <div class="col-md-12 col-sm-12 col-xs-12 adjustUserName">\
                                            <span>'+ comments.Users.FullName + '</span>\
                                        </div>\
                                        <div class="col-md-12 col-sm-12 col-xs-12 adjustUserRate">\
                                            <span id="spnRate' + comments.Users.Id + '">\
                                                <span id="userStar1' + comments.Users.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar2' + comments.Users.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar3' + comments.Users.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar4' + comments.Users.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar5' + comments.Users.Id + '" class="fa fa-star-o lightGray"></span>\
                                            </span>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-9 col-sm-9 col-xs-8 adjustUserReview">\
                                        <em id="spn' + comments.Users.Id + '">' + review + '</em>\
                                    </div>\
                                </div>');
                        for (var i = 0; i < comments.Rate; i++) {
                            var increase = i + 1;
                            $('#userStar' + increase + comments.Users.Id).removeClass('fa-star-o lightGray').addClass('fa-star yellowStar');
                        }

                    });
                }
                $('.dvHome').fadeOut(200, function () {
                    $('.dvProfile').removeClass("hidden");
                    $('.dvProfile').show();
                });
            }
            else {
            }
        }, false);
    }
}
function resetAvgRate() {
    $('#dvAvgRate').empty();
    $('#dvAvgRate').append('<span id="star1" class="glyphicon glyphicon-star-empty lightGray"></span>\
                                    <span id="star2" class="glyphicon glyphicon-star-empty lightGray"></span>\
                                    <span id="star3" class="glyphicon glyphicon-star-empty lightGray"></span>\
                                    <span id="star4" class="glyphicon glyphicon-star-empty lightGray"></span>\
                                    <span id="star5" class="glyphicon glyphicon-star-empty lightGray"></span>')
}
function resetUserRate(id) {
    $('#spnRate' + id).empty();
    $('#spnRate' + id).append('<span id="userStar1' + id + '" class="fa fa-star-o lightGray"></span>\
                                    <span id="userStar2'+ id + '" class="fa fa-star-o lightGray"></span>\
                                    <span id="userStar3'+ id + '" class="fa fa-star-o lightGray"></span>\
                                    <span id="userStar4'+ id + '" class="fa fa-star-o lightGray"></span>\
                                    <span id="userStar5'+ id + '" class="fa fa-star-o lightGray"></span>')
}
$('#rating-input').on('rating.change', function () {
    var _Url = APILink + '/api/Reviews/RateRestaurant';
    var _Type = "post";
    var _Data = JSON.stringify({
        'RestaurantId': restaurantId,
        'UserId': currentUser.Id,
        'Rate': $('#rating-input').val()
    });
    CallAPI(_Url, _Type, _Data, function (data) {
        if (data.Code == 100) {
            // update avg rate part
            resetAvgRate();
            for (var i = 0; i < data.Data; i++) {
                var increase = i + 1;
                $('#star' + increase).removeClass('glyphicon glyphicon-star-empty lightGray').html('<img src="images/half.png" class="half2" />');
            }
            var review = data.Data.Review;
            if (review == null) {
                review = "";
            }
            $('#dvAllReviews').prepend('<div class="col-md-12 col-sm-12 col-xs-12 adjusrReviews">\
                                    <div class="col-md-3 col-sm-3 col-xs-4 adjustUserInfo">\
                                        <div class="col-md-12 col-sm-12 col-xs-12 adjustUserName">\
                                            <span>' + data.Data.FullName + '</span>\
                                        </div>\
                                        <div class="col-md-12 col-sm-12 col-xs-12 adjustUserRate">\
                                            <span id="spnRate' + data.Data.Id + '">\
                                                <span id="userStar1' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar2' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar3' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar4' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar5' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                            </span>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-9 col-sm-9 col-xs-8 adjustUserReview">\
                                        <em id="spn' + data.Data.Id + '">' + review + '</em>\
                                    </div>\
                                </div>');
            // update avg rate
            resetAvgRate();
            for (var i = 1; i <= data.Data.AvgRate; i++) {
                $('#star' + i).removeClass('glyphicon-star-empty lightGray').addClass('glyphicon-star yellowStar');
                if (i + .5 == data.Data.AvgRate) {
                    var next = i + 1;
                    $('#star' + next).removeClass('glyphicon glyphicon-star-empty lightGray').addClass(' half');
                }
            }
            // update user rate
            for (var i = 0; i < data.Data.Rate; i++) {
                var increase = i + 1;
                $('#userStar' + increase + data.Data.Id).removeClass('fa-star-o lightGray').addClass('fa-star yellowStar');
            }
            $('#txtAddReview').val("");
        }
        else if (data.Code == 200) {
            // update avg rate
            resetAvgRate();
            for (var i = 1; i <= data.Data.AvgRate; i++) {
                $('#star' + i).removeClass('glyphicon-star-empty lightGray').addClass('glyphicon-star yellowStar');
                if (i + .5 == data.Data.AvgRate) {
                    var next = i + 1;
                    $('#star' + next).removeClass('glyphicon-star-empty lightGray').addClass('glyphicon-star half');
                }
            }

            // update user rate;
            resetUserRate(data.Data.Id);
            for (var i = 0; i < data.Data.Rate; i++) {
                var increase = i + 1;
                $('#userStar' + increase + data.Data.Id).removeClass('fa-star-o lightGray').addClass('fa-star yellowStar');
            }
        }
        else {
            console.log(data.Code);
        }
    }, false);

});
function addReview() {
    if ($('#txtAddReview').val() != "") {
        $('#dvMessage').addClass('hidden').removeClass('show');

        var _Url = APILink + '/api/Reviews/AddReview';
        var _Type = "post";
        var _Data = JSON.stringify({
            'RestaurantId': restaurantId,
            'UserId': currentUser.Id,
            'Review': $('#txtAddReview').val()
        });
        CallAPI(_Url, _Type, _Data, function (data) {
            if (data.Code == 100) {
                // update reviews part & prepend new one
                $('#spn' + currentUser.Id).text(data.Data.Review);
                $('#txtAddReview').val("");
            }
            else if (data.Code == 200) {
                $('#dvAllReviews').prepend('<div class="col-md-12 col-sm-12 col-xs-12 adjusrReviews">\
                                    <div class="col-md-3 col-sm-3 col-xs-4 adjustUserInfo">\
                                        <div class="col-md-12 col-sm-12 col-xs-12 adjustUserName">\
                                            <span>' + data.Data.FullName + '</span>\
                                        </div>\
                                        <div class="col-md-12 col-sm-12 col-xs-12 adjustUserRate">\
                                            <span id="spnRate' + data.Data.Id + '">\
                                                <span id="userStar1' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar2' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar3' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar4' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                                <span id="userStar5' + data.Data.Id + '" class="fa fa-star-o lightGray"></span>\
                                            </span>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-9 col-sm-9 col-xs-8 adjustUserReview">\
                                        <em id="spn' + data.Data.Id + '">' + data.Data.Review + '</em>\
                                    </div>\
                                </div>');
                for (var i = 0; i < data.Data.Rate; i++) {
                    var increase = i + 1;
                    $('#userStar' + increase + data.Data.Id).removeClass('fa-star-o lightGray').addClass('fa-star yellowStar');
                }
                $('#txtAddReview').val("");
            }
            else {
                console.log(data.Code);
            }
        }, false);
    }
    else {
        $('#dvMessage').addClass('show').removeClass('hidden');
    }

}
$('#txtAddReview').focus(function () { $('#footer').hide(); });
$('#txtAddReview').blur(function () { $('#footer').show(); });