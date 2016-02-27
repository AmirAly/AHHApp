//var APILink = 'http://localhost:51923/';
var APILink = 'http://ahhapi.deltacode.co/';
var hidden = false;
function navigateTo(_link) {
    location.href = _link;
}
function sort(_commonClass, _attribute, _container) {
    var divList = $("." + _commonClass);
    var sortedSet = divList.toArray().sort(function (a, b) {
        return $(b).data(_attribute) - $(a).data(_attribute);
    });
    $("#" + _container).html(sortedSet);
    $(".sortable").click(function () {
        $('.dvHome').fadeOut(200, function () {
            $('.dvProfile').removeClass("hidden");
            $('.dvProfile').show();
        });
    })
}

function InitSideBar() {
    var _Url = APILink + 'api/Menu/GetAll';
    var _Type = "get";
    var _Data = {};
    CallAPI(_Url, _Type, _Data, function (data) {
        if (data.Code == 100) {
            $('.sidebar-nav').empty();
            $('.sidebar-nav').append('<li class="sidebar-brand"></li>');
            $.each(data.Data, function (index, Obj) {
                $('.sidebar-nav').append('\
                                    <li>\
                                    <a href="#" onclick="window.open(\''+Obj.lINK+'\', \'_blank\',\'location=yes\');" target="_blank"> <span style="color:' + Obj.Color + '" class="glyphicon glyphicon-' + Obj.Icon + '"></span> ' + Obj.Title + '</a>\
                                     </li>');
            });
            $('.sidebar-nav').append('\
                                    <li>\
                                    <a href="javascript:signout();"> <span style="color:#ff24499" class="glyphicon glyphicon-user"></span> Sign Out</a>\
                                     </li>');
        }
    }, false);
}
function signout()
{
    localStorage.clear();
    location.href = "index.html";
}
function sortAscendeing(_commonClass, _attribute, _container) {
    var divList = $("." + _commonClass);
    var sortedSet = divList.toArray().sort(function (a, b) {
        return $(a).data(_attribute) - $(b).data(_attribute);
    });
    $("#" + _container).html(sortedSet);
    $(".sortable").click(function () {
        $('.dvHome').fadeOut(200, function () {
            $('.dvProfile').removeClass("hidden");
            $('.dvProfile').show();
        });
    })
}

$("#allRestaurantDv").click(function () {
    navigateTo("home.html");
});
$("#locationDv").click(function () {
    navigateTo("resturants.html");
});
$("#menuDv").click(function (e) {
    e.preventDefault();
    hidden = !hidden;
    if (hidden == true) {
        $("#page-content-wrapper").toggle();
        $("#wrapper").toggleClass("toggled");
        $('#sidebar-wrapper').css('border-left', 'solid 5px  #a73135')

    }
    else {
        $("#wrapper").toggleClass("toggled");
        setTimeout(function () { $("#page-content-wrapper").toggle(); }, 200);
        $('#sidebar-wrapper').css('border-left', 'none 5px  #a73135')
    }
});
var _start;
var _end;
$(document).on("mousedown touchstart", function (e) {
    _start = e.pageX;
});
$(document).on("mouseup touchend", function (e) {
    _end = e.pageX;
    if(_end - _start > 50)
    {
        if (hidden === true) {
            hidden = !hidden;
            $("#wrapper").toggleClass("toggled");
            setTimeout(function () { $("#page-content-wrapper").toggle(); }, 200);
            $('#sidebar-wrapper').css('border-left', 'none 5px  #a73135')

        }
    }
    if(_start - _end > 50)
    {
        $("#menuDv").click();
    }
});
function CallAPI(_url, _type, _data, onsuccess, cashed) {
    $.ajax({
        url: _url,
        type: _type,
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            var Cashed = localStorage.getItem(_url);
            if (cashed == false || Cashed === null) {
                $.loader({
                    className: "blue-with-image",
                    content: ''
                });
            }
            else {
                onsuccess(JSON.parse(Cashed));
            }
        },
        success: function (data) {
            localStorage.setItem(_url, JSON.stringify(data));
            onsuccess(data);
            $.loader('close');
        },
        complete: function () {
            $.loader('close');
        },
        error: function (request, status, err) {
            console.debug(request);
            console.debug(status);
            console.debug(err);
            console.log('warning', 'Connection error , please try again later ');
        }
    });
}

//Get URL Parameters
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


//get from local storage
var currentUser = JSON.parse(localStorage.getItem('userObject'));
