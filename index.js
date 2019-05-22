var d = new Date();
var year = d.getFullYear();
var monthNo = d.getMonth();
var month = monthNo+1;
var day = d.getDate();
var dayOfWeekName;
var hourTwentyFour;
var pos;
var geocoder;
var lat;
var lng;
var marker;
var destinationInput;
var destinationAutocomplete;
var orginInput;
var orginAutocomplete;
var placeInput;
var placeAutocomplete;
var directionsDisplay;
var directionsService;
var start;
var end;
var mode;
var distance;
var autoTrack;
var endCode;
var eventList;
var geoCode;
var starts = moment($("#start-date").val() , $("#start-time").val()).add(8, 'h');
var ends = moment($("#end-date").val() , $("#end-time").val()).add(8, 'h');
var weatherURL;
var weatherURL2;
var currentWeather;
var day1weather;
var day2weather;
var day3weather;
var day4weather;
var date1;
var date2;
var date3;
var date4;
var code;
var modes;
var start2
var key;
$(document).ready(function(){
        getCurrentTime();
        setInterval(getCurrentTime,60000);
        $("#agenda").hide();
        $("#agenda-map").hide();
        $("#directory").hide();
        getEventList();
        getGeoCode1();
        setInterval(getGeoCode1,180000);
        loadCalandar();
        autoComplete();
        $("#page1").click(function(){
            getCurrentTime();
            $("#agenda").hide("slideRight");
            $("#directory").hide("slideRight");
            $("#home").show("slide");
            getEventList();
            getGeoCode1();
            loadCalandar();
        });
        $("#refresh1").click(function(){
            getEventList();
            getCurrentTime();
            getGeoCode1();
            loadCalandar();
        });
        $("#page2").click(function(){
            $("#home").hide("slideRight");
            $("#warning").hide("slideRight");
            $("#directory").hide("slideRight");
            $("#agenda-map").hide("slideRight");
            $("#agenda").show("slide");
            $("#add-event").click(function(){
                $("#adding-event").modal();
                autoComplete();
            });
            loadCalandar();
        });
        $("#clear").click(function(event){
            $("#warning").modal();
            //$("#clear").hide("slideRight");
        });
        $("#yes").click(function(event){
            localStorage.clear();
            alert("All records are being cleared");
            $('#warning').hide("slideRight");
            $("#clear").show("slide");
            console.log(localStorage.length);
            getEventList();
            loadCalandar();
            location.reload();
        });
        $("#no").click(function(event){
            $('#warning').hide();
            $("#clear").show();
        });
        $("#refresh2").click(function(){
            getEventList();
            loadCalandar();
        });
        $("#submit-event").click(function() {
            event.preventDefault();
            if($("#address").val().length >0){
                getGeo();
                geoCode = endCode;
            }
            else{
                geoCode = "";
            }
            var id;
            if(localStorage.length === 0){
                id=0;
            }
            else if(localStorage.length > 0){
                id=localStorage.length+1;
            }    
            var title = $("#event-title").val();
            var start =  starts;
            var end = ends;
            var location = $("#address").val();
            var mode = $("input:radio[name=travel]:checked").val();
            var note= $("#note").val();
            geoCode = endCode;
            var temp = new calandarEvent(id, title, start, end, location, mode, note, geoCode);
            alert("Event have been recorded");
            storeEvent(temp);
            console.log(temp);
            getEventList();
            loadCalandar();
            location.reload();
        });
        /*$("#delete").click(function(){
            $("#event-txt").hide("fadeOut");
            $("#warning-txt").show("fadeIn");
            $("#event-nav").hide("fadeOut");
            $("#warning2").show("fadeIn");
        });
        $("#yes1").click(function(){
            localStorage.removeItem(eventList[key]);
            alert("Event Have been Deleted");
        });
        $("#no1").click(function(){
            $("#event-txt").show("fadeIn");
            $("#warning-txt").hide("fadeOut");
            $("#event-nav").show("fadeIn");
            $("#warning2").hide("fadeOut");
        });*/
        $("#find").click(function(){
            $("#agenda").hide("slideRight");
            $("#fullCalModal").modal('hide');
            $("#agenda-map").show("slide");
            initMap4();
        });
        $("#back-event").click(function(){
            $("#agenda-map").hide("slide");
            $("#agenda").show("slide");
        });
        $("#page3").click(function(){
            $("#home").hide();
            $("#agenda").hide();
            $("#directory").show("slide");
            $("#guide").hide();
            $("#start-track").hide();
            $("#stop-track").hide();
            //$("#request").hide();
            initMap1();
            getLocation2();
        });
        $("#find-location").click(function(){
            initMap1();
            getLocation2();
            autoComplete();
            $("#start-track").show("slide");
            //$("#request").show("slideDown");
        });
        $("#start-track").click(function(){
            getAutoGeoCode();
            $("#find-location").hide("slide");
            $("#start-track").hide("slide");
            $("#stop-track").show("slide");
        });
        $("#stop-track").click(function(){
            $("#find-location").show("slide");
            $("#start-track").show("slide");
            $("#stop-track").hide("slide");
            stopAutoGeoCode();
        });
        $("#request").submit(function(event) {
            event.preventDefault();
            $("#request").hide("slideUp");
            $("#find-location").hide("slideUp");
            $("#start-track").hide("slideUp");
            $("#stop-track").hide("slideUp");
            $("#guide").show("slideDown");
            $("#guide").show("slideDown");
            $("#start").hide();
            $("#back").hide();
            $("#stop").hide();
            if($("#orgin").val().length === 0){
                mode = $("input:radio[name=transport]:checked").val();
                start = pos;
                initMap3();
                calculateDistance();
                checkMode();
                checkDistance();
                $("#start").show("slideDown");
                $("#back").show("slideDown");   
            }   
            else{ 
                $("#far").hide();
                $("#distance").hide();
                mode = $("input:radio[name=transport]:checked").val();
                initMap2();
                checkMode();
                $("#back").show("slideDown");
            }
        });
    $("#start").click(function(){
        $("#stop").show();
        $("#start").hide();
        getAutoGeoCode();
        setInterval(initMap3,10000);
        setInterval(calculateDistance,10000);
        setInterval(checkDistance,10000);
    });  
    $("#stop").click(function(){   
        stopAutoGeoCode();
        clearInterval(setInterval(initMap3,10000));
        clearInterval(setInterval(calculateDistance,10000));
        clearInterval(setInterval(checkDistance,10000));
        $("#start").show("slide");
        $("#stop").hide("slide");
        $("#back").show("slide");
    });
    $("#back").click(function(){
        clearInterval(setInterval(initMap3,10000));
        clearInterval(setInterval(calculateDistance,10000));
        clearInterval(setInterval(checkDistance,10000));
        getGeoCode2();
        initMap1();
        $("#guide").hide("slideUp");
        $("#request").show("slideDown");
        $("#orgin").val(" ");
        $("#destination").val(" ");
        start = " ";
        end = " ";
        mode = " ";
        directionDisplay.setPanel(null);
    });
});    
function getCurrentTime() {
    hourTwentyFour = d.getHours();
    var minute = d.getMinutes();
    var dayOfWeekNo = d.getDay();
    var monthName;
    var hourTwelve;
    var meridiem;
    if (monthNo === 0){
        monthName = "January";
     }
    else if (monthNo === 1){
        monthName = "February";
    }
    else if (monthNo === 2){
        monthName = "March";
    }
    else if (monthNo === 3){
        monthName = "April";
    }
    else if (monthNo === 4){
        monthName = "May";
    }
    else if (monthNo === 5){
        monthName = "June";
    }
    else if (monthNo === 6){
        monthName = "July";
    }
    else if (monthNo === 7){
        monthName = "August";
    }
    else if (monthNo === 8){
        monthName = "September";
    }
    else if (monthNo === 9){
        monthName = "October";
    }
    else if (monthNo === 10){
        monthName = "November";
    }
    else if (monthNo === 11){
        monthName = "December";
    } 
    if (hourTwentyFour > 12){
        hourTwelve = hourTwentyFour-12;
        meridiem = "p.m.";
    }
    if (hourTwentyFour === 12){
        hourTwelve = hourTwentyFour;
        meridiem = "p.m.";
    }
    else if (hourTwentyFour < 12){
        hourTwelve = hourTwentyFour;
        meridiem = "a.m.";
    }       
    if (dayOfWeekNo === 0){
        dayOfWeekName = "Sunday";
    }
    else if (dayOfWeekNo === 1){
        dayOfWeekName = "Monday";
    }
    else if (dayOfWeekNo === 2){
        dayOfWeekName = "Tuesday";
    }
    else if (dayOfWeekNo === 3){
        dayOfWeekName = "Wednesday";
    }
    else if (dayOfWeekNo === 4){
        dayOfWeekName = "Thursday";
    }
    else if (dayOfWeekNo === 5){
        dayOfWeekName = "Friday";
    }
    else if (dayOfWeekNo === 6){
        dayOfWeekName = "Saturday";
     }  
    if (minute < 10){
        minute="0"+minute;
    }
    $("#time").text(hourTwelve+":"+minute+" "+meridiem);
    $("#day").text(dayOfWeekName);
    $("#date1").text(day+" "+monthName+" "+year);
}
function getGeoCode1(){
    geocoder = new google.maps.Geocoder;
    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                lat = pos.lat.toString();
                lng = pos.lng.toString();
                start2 = pos;
                weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid=ba8b7f15eb67ecb1132fdcaa03320ba8";
                weatherURL2 = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lng+"&appid=ba8b7f15eb67ecb1132fdcaa03320ba8";
                getLocation();
                getWeather();
                getWeather2();
        }, function () {
                handleLocationError(true);
            });
        }
        else {
            handleLocationError(false);
        }
}
function getLocation() {
    geocoder.geocode({'location': pos }, function (results, status) {
        if (status == 'OK') {
            $("#current-location1").text(results[2].formatted_address);
        }
    });
}
function getLocation2() {
    geocoder.geocode({'location': pos }, function (results, status) {
        if (status == 'OK') {
            $("#current-location2").text(results[0].formatted_address);
        }
    });
}  
function getWeather(){
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function(){
      if(XHR.readyState == 4 && XHR.status == 200){
        var result = XHR.responseText;
        var reply = JSON.parse(result);
        currentWeather=reply.weather[0].main;
        $("#current-weather").text(currentWeather);
        if (currentWeather === "Clear"){
            if(hourTwentyFour >= 7){
                $("#current-weather-icon").attr("src","css/image/SunIcon.png");
                $("body").css('background-image', "url('css/image/SunnyBackground.png')");
            }
            else if(hourTwentyFour >= 19){
                $("#current-weather-icon").attr("src","css/image/MoonIcon.png");
                $("body").css('background-image', "url('css/image/NightBackground.png')");
            }
        }
        else if (currentWeather === "Clouds"){
            $("#current-weather-icon").attr("src","css/image/CloudIcon.png");
            if(hourTwentyFour >= 7){
                $("body").css('background-image', "url('css/image/CloudyBackground.png')");
            }
            else if(hourTwentyFour >= 19){
                $("body").css('background-image', "url('css/image/NightCloudyBackground.png')");
            }
        }
        else if (currentWeather === "Thunderstorm"){
            $("#current-weather-icon").attr("src","css/image/ThunderstormIcon.png");
            if(hourTwentyFour >= 7){
                $("body").css('background-image', "url('css/image/ThunderstormBackground.png')");
            }
            else if(hourTwentyFour >= 19){
                $("body").css('background-image', "url('css/image/NightThunderstormBackground.png')");
            }
        }
        else if (currentWeather === "Drizzle"){
            $("#current-weather-icon").attr("src","css/image/ShowerIcon.png");
            if(hourTwentyFour >= 7){
                $("body").css('background-image', "url('css/image/ShowerRainBackground.png')");
            }
            else if(hourTwentyFour >= 19){
                $("body").css('background-image', "url('css/image/NightShowerBackground.png')");
            }
        }
        else if (currentWeather === "Rain"){
            $("#current-weather-icon").attr("src","css/image/RainIcon.png");
            console.log("test");
            if(hourTwentyFour >= 7){
                $("body").css('background-image', "url('css/image/RainBackground.png')");
            }
            else if(hourTwentyFour >= 19){
                $("body").css('background-image', "url('css/image/NightRainBackground.png')");
            }
            console.log(hourTwentyFour);
        }
      }
    };
    XHR.open("GET",weatherURL);
    XHR.send();  
}
function getWeather2(){
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function(){
      if(XHR.readyState == 4 && XHR.status == 200){
        var result = XHR.responseText;
        var reply = JSON.parse(result);
        date1 = reply.list[8].dt_txt.split(" ", 5);
        console.log(reply);
        date2 = reply.list[16].dt_txt.split(" ", 5);
        if(reply.length >=40){
            date3 = reply.list[19].dt_txt.split(" ", 5);
            date4 = reply.list[21].dt_txt.split(" ", 5);
        }
        else{
            date3 = reply.list[19].dt_txt.split(" ", 5);
            date4 = reply.list[21].dt_txt.split(" ", 5);
        }
        $("#day1date").text(date1[0]);
        $("#day1day").text(moment(date1[0]).format("dddd"));
        $("#day2date").text(date2[0]);
        $("#day2day").text(moment(date2[0]).format("dddd"));
        $("#day3date").text(date3[0]);
        $("#day3day").text(moment(date3[0]).format("dddd"));
        $("#day4date").text(date4[0]);
        $("#day4day").text(moment(date4[0]).format("dddd"));
        day1weather = reply.list[8].weather[0].main;
        day2weather = reply.list[16].weather[0].main;
        if(reply.length >=40){
            day3weather = reply.list[24].weather[0].main;
            day4weather = reply.list[32].weather[0].main;
        }
        else{
            day3weather = reply.list[19].weather[0].main;
            day4weather = reply.list[21].weather[0].main;
        }
        $("#day1").text(day1weather);
        $("#day2").text(day2weather); 
        $("#day3").text(day3weather);
        //$("#day4").text(day4weather);
        if (day1weather === "Clear"){
             $("#day1-weather-icon").attr("src","css/image/SunIcon.png");
        }
        else if (day1weather === "Clouds"){
            $("#day1-weather-icon").attr("src","css/image/CloudIcon.png");
        }
        else if (day1weather === "Thunderstorm"){
            $("#day1-weather-icon").attr("src","css/image/ThunderstormIcon.png");
        }
        else if (day1weather === "Drizzle"){
            $("#day1-weather-icon").attr("src","css/image/ShowerIcon.png");
        }
        else if (day1weather === "Rain"){
            $("#day1-weather-icon").attr("src","css/image/RainIcon.png");
        }
        if (day2weather === "Clear"){
            $("#day2-weather-icon").attr("src","css/image/SunIcon.png");
        }
        else if (day2weather === "Clouds"){
            $("#day2-weather-icon").attr("src","css/image/CloudIcon.png");
        }
        else if (day2weather === "Thunderstorm"){
            $("#day2-weather-icon").attr("src","css/image/ThunderstormIcon.png");
        }
        else if (day2weather === "Drizzle"){
            $("#day2-weather-icon").attr("src","css/image/ShowerIcon.png");
        }
        else if (day2weather === "Rain"){
            $("#day2-weather-icon").attr("src","css/image/RainIcon.png");
        }
        if (day3weather === "Clear"){
            $("#day3-weather-icon").attr("src","css/image/SunIcon.png");
        }
        else if (day3weather === "Clouds"){
            $("#day3-weather-icon").attr("src","css/image/CloudIcon.png");
        }
        else if (day3weather === "Thunderstorm"){
            $("#day3-weather-icon").attr("src","css/image/ThunderstormIcon.png");
        }
        else if (day3weather === "Drizzle"){
            $("#day3-weather-icon").attr("src","css/image/ShowerIcon.png");
        }
        else if (day3weather === "Rain"){
            $("#day3-weather-icon").attr("src","css/image/RainIcon.png");
        }
        /*if (day4weather === "Clear"){
            $("#day4-weather-icon").attr("src","css/image/SunIcon.png");
        }
        else if (day4weather === "Clouds"){
            $("#day4-weather-icon").attr("src","css/image/CloudIcon.png");
        }
        else if (day4weather === "Thunderstorm"){
            $("#day4-weather-icon").attr("src","css/image/ThunderstormIcon.png");
        }
        else if (day4weather === "Drizzle"){
            $("#day4-weather-icon").attr("src","css/image/ShowerIcon.png");
        }
        else if (day4weather === "Rain"){
            $("#day4-weather-icon").attr("src","css/image/RainIcon.png");
        }*/
      }
    };
    XHR.open("GET",weatherURL2);
    XHR.send();  
}
function getEventList() {
    if (window.localStorage) {
        eventList = JSON.parse(localStorage.getItem("eventList"));
    }
    console.log(eventList);
}
function loadCalandar(){
    $("#calendar1").fullCalendar({
        header: {
            left: 'prev,next',
            right: 'listDay,listWeek'
        },
        views: {
            prev: {buttonText: '<'},
            next: {buttonText: '>'},
            listDay: {buttonText: "Today's Event"},
            listWeek: {buttonText: "This Week's Event"}
        },
        defaultView: 'listDay',
        defaultDate: d.toISOString(),
        eventLimit: true,
        events: eventList
    });
    $("#calendar2").fullCalendar({
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'today'
        },
        views: {
            today: {buttonText: "Today"}
        },
        eventClick:  function(event, jsEvent, view) {
            $('#modalTitle').html(event.title);
            $('#modalStart').html(event.start);
            $('#modalEnd').html(event.end);
            $('#modalPlace').html(event.location);
            $('#modalMemo').html(event.note);
            $('#fullCalModal').modal();
            $("#warning-txt").hide();
            $("#warning2").hide();
            $("#delete").hide();
            var id=  event.id;
            key = id.toString();
            if(event.location.length >0){
                $("#find").show();
            }
            else{
                $("#find").hide();
                $("#mini").hide();
            }
            code = event.geoCode;
            modes = event.mode;
            map = new google.maps.Map(document.getElementById('mini'), {
                zoom: 16,
                center: code,
                mapTypeId: 'hybrid'
            });
            var marker = new google.maps.Marker({
                position: code,
                map: map,
            });
        },
        eventLimit: true,
        events: eventList,
        aspectRatio: 0.5,
        contentHeight: 650
    });
    $("#calendar3").fullCalendar({
        header: {
            left: 'prev,next',
            right: 'listDay,listWeek,listMonth,,agendaDay,agendaWeek'
        },
        views: {
            prev: {buttonText: '<'},
            next: {buttonText: '>'},
            agendaWeek: {buttonText: "This Week's Agenda"},
            agendaDay: {buttonText: "Today's Agenda"},
            listDay: {buttonText: "Today's Event"},
            listWeek: {buttonText: "This Week's Event"},
            listMonth: {buttonText: "This Month's Event"}
        },
        eventClick:  function(event, jsEvent, view) {
            $('#modalTitle').html(event.title);
            $('#modalStart').html(event.start);
            $('#modalEnd').html(event.end);
            $('#modalPlace').html(event.location);
            $('#modalMemo').html(event.note);
            $('#fullCalModal').modal();
            $("#warning-txt").hide();
            $("#warning2").hide();
            $("#delete").hide();
            var id=  event.id;
            key = id.toString();
            if(event.location.length >0){
                $("#find").show();
            }
            else{
                $("#find").hide();
                $("#mini").hide();
            }
            code = event.geoCode;
            modes = event.mode;
            map = new google.maps.Map(document.getElementById('mini'), {
                zoom: 16,
                center: code,
                mapTypeId: 'hybrid'
            });
            var marker = new google.maps.Marker({
                position: code,
                map: map,
            });
        },
        defaultView: 'listDay',
        nowIndicator: true,
        defaultDate: d.toISOString(),
        eventLimit: true,
        events: eventList,
        aspectRatio: 0.5,
        contentHeight: 500
    });
}
function calandarEvent(id, title, start, end, location, mode, note, geoCode) {
    this.id = id;
    this.title = title;
    this.start = start;
    this.end = end;
    this.location = location;
    this.mode = mode;
    this.note = note
    this.geoCode = geoCode;
}
function storeEvent(temp) {
    if (window.localStorage) {
         var eventList = JSON.parse(localStorage.getItem("eventList"));
            if (eventList === null)
                eventList = []
                eventList.push(temp);
                updateEventList(eventList);
     }
}
function updateEventList(arr) {
    localStorage.setItem("eventList", JSON.stringify(arr));
    alert("Event have been recorded");
}
function getGeo(){
    var destination = placeAutocomplete.getPlace();
    var destinationLat = destination.geometry.location.lat();
    var destinationLng = destination.geometry.location.lng();
    endCode = {lat: destinationLat, lng: destinationLng};
}
function initMap4() {
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;
    map = new google.maps.Map(document.getElementById('map1'), {
        zoom: 10,
        center: {lat: 1.3521, lng: 103.8198},
        mapTypeId: 'hybrid'
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('direction1'));
    calculateAndDisplayRoute4(directionsService, directionsDisplay);
}	
function calculateAndDisplayRoute4(directionsService, directionsDisplay) {
    directionsService.route({
        origin: start2,
        destination: code,
        travelMode: modes,
        transitOptions:{
            routingPreference: 'LESS_WALKING',
            routingPreference: 'FEWER_TRANSFERS'
        },
        optimizeWaypoints: true,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.METRIC,
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        }
        else {
            alert('Directions request failed due to ' + status);
        }
    });
}
function getGeoCode2(){
  geocoder = new google.maps.Geocoder;
    if (navigator.geolocation) {
            autoTrack = navigator.geolocation.getCurrentPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            map.setCenter(pos);
            marker = new google.maps.Marker({position: pos, map: map});
            map.setZoom(16);
        }, function () {
                handleLocationError(true, map.getCenter());
            });
        }
        else {
            handleLocationError(false, map.getCenter());
        }
}
function getGeoCode3(){
    geocoder = new google.maps.Geocoder;
    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                lat = pos.lat.toString();
                lng = pos.lng.toString();
        }, function () {
                handleLocationError(true);
            });
        }
        else {
            handleLocationError(false);
        }
}
function initMap1() {
    map = new google.maps.Map(document.getElementById('map2'), {
        zoom: 10,
        center: {lat: 1.3521, lng: 103.8198},
        mapTypeId: 'hybrid'
    });
    getGeoCode2();
    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
}
function getAutoGeoCode(){
  geocoder = new google.maps.Geocoder;
    if (navigator.geolocation) {
            autoTrack = navigator.geolocation.watchPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            map.setCenter(pos);
            marker = new google.maps.Marker({position: pos, map: map});
            map.setZoom(16);
            console.log("start auto track");
        }, function () {
                handleLocationError(true, map.getCenter());
            });
        }
        else {
            handleLocationError(false, map.getCenter());
        }
}
function stopAutoGeoCode(){
    navigator.geolocation.clearWatch(autoTrack);
    console.log("stop auto track");
}
function autoComplete(){
    orginInput = document.getElementById('orgin');  
    orginAutocomplete = new google.maps.places.Autocomplete(orginInput);
    destinationInput = document.getElementById('destination');  
    destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
    placeInput = document.getElementById('address');  
    placeAutocomplete = new google.maps.places.Autocomplete(placeInput);
}
function initMap2() {
    getGeoCon1();
    getGeoCon2();
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;
    map = new google.maps.Map(document.getElementById('map2'), {
        zoom: 10,
        center: {lat: 1.3521, lng: 103.8198},
        mapTypeId: 'hybrid'
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('direction2'));
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    checkMode();
}	
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: mode,
        transitOptions:{
            routingPreference: 'LESS_WALKING',
            routingPreference: 'FEWER_TRANSFERS'
        },
        optimizeWaypoints: true,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.METRIC,
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        }
        else {
            alert('Directions request failed due to ' + status);
        }
    });
}
function initMap3() {
    getGeoCon1();
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;
    map = new google.maps.Map(document.getElementById('map2'), {
        zoom: 10,
        center: {lat: 1.3521, lng: 103.8198},
        mapTypeId: 'hybrid'
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('direction2'));
    calculateAndDisplayRoute2(directionsService, directionsDisplay);
    checkMode();
}	
function calculateAndDisplayRoute2(directionsService, directionsDisplay) {
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: mode,
        transitOptions:{
            routingPreference: 'LESS_WALKING',
            routingPreference: 'FEWER_TRANSFERS'
        },
        optimizeWaypoints: true,
        unitSystem: google.maps.UnitSystem.METRIC,
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        }
        else {
            alert('Directions request failed due to ' + status);
        }
    });
}
function getGeoCon1(){
    console.log(pos);
    var destination = destinationAutocomplete.getPlace();
    var destinationLat = destination.geometry.location.lat();
    var destinationLng = destination.geometry.location.lng();
    end = {lat: destinationLat, lng: destinationLng};
}

function getGeoCon2(){
    var orgin = orginAutocomplete.getPlace();
    var orginLat = orgin.geometry.location.lat();
    var orginLng = orgin.geometry.location.lng();
    start = {lat: orginLat, lng: orginLng};
}
function calculateDistance(){
    var sc = new google.maps.LatLng(start.lat, start.lng);
    var ec = new google.maps.LatLng(end.lat, end.lng);
    distance = google.maps.geometry.spherical.computeDistanceBetween(sc,ec);
    if(distance <= 50){
        alert("You arrived at your destination")
    }
}
function checkDistance(){
     if(distance >= 1000){
        var m = distance/1000;
        var km = m.toFixed(2)
        $("#distance").text(km+"km");
    }
    
     else if(distance < 1000){
        var m = distance.toFixed(2);
        $("#distance").text(m+"m");
    }
}
function checkMode(){
    if(mode === "DRVING"){
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
    }
    else if(mode === "TRANSIT"){
        var transitLayer = new google.maps.TransitLayer();
        transitLayer.setMap(map);
    }
}