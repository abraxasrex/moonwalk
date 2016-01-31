(function () {
  var moonWalkApp = angular.module('MoonWalk', []);
  moonWalkApp.controller('MapController', function ($scope) {

    var directionsService;
    var directionsDisplay;

    var map;
    var infoWindow;
    var user_origin = "Seattle, WA";
    var user_destination = "Golden Gate Bridge";
    $scope.destination = "Golden Gate Bridge";
    $scope.origin = "Seattle, WA";
    //var waypoints= [{location: 'Tacoma, WA'}, {location: 'Portland, OR'}];
    var global_waypoints = [];
    var transit_type = "DRIVING";
    var waypoint_markers = [];
    var markers = [];

    $(function () {

      directionsService = new google.maps.DirectionsService();

      /*
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: 47.610, lng: 122.333}  // Seattle
        });
      */
      var user_lat;
      var user_lng;

      if(navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          user_lat = position.coords.latitude;
          user_lng = position.coords.longitude;
          infoWindow = new google.maps.InfoWindow({
            map: map
          });
          infoWindow.setPosition(pos);
          infoWindow.setContent('You are here.');

          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: {
              lat: user_lat,
              lng: user_lng
            }
          });

          map.setCenter(pos);

          directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: true,
            map: map,
            panel: document.getElementById('right-panel')
          });

          directionsDisplay.addListener('directions_changed', function () {
            computeTotalDistance(directionsDisplay.getDirections());
            watch_waypoints();
          });


        }, function () {
          handleLocationError(true, infoWindow, map.getCenter());
        });

        //load local attractions with radius - get request pass: 8 km radius maybe pass: user preference for p.o.i.///
        //place markers based on name, lat, long ///
        /*
    var results=[];
    for(var i=0; i<results.length; i++){
      var lat= results[i].lat;
      var lng= results[i].lng;
      var name= results[i].name;
      var latlng= {lat, lng};
     var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: name
     });
  }
  */
      } else {
        // Browser doesn't support Geolocation
        console.log("ahhhhhh no location!")
        handleLocationError(false, infoWindow, map.getCenter());
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {
            lat: 47.610,
            lng: 122.333
          } // Seattle
        });
      }
    });
    ///END of INIT  ^   ////////
    //  directionsDisplay.setMap(map);

    function displayRoute(origin, destination, service, display, waypoints) {
      //handler for waypoint array//
      var ary;
      if(waypoints) {
        ary = waypoints.map(function (wpt) {
          return {
            location: wpt,
            stopover: false
          };
        });
      } else {
        ary = [];
      }
      service.route({
        origin: origin,
        destination: destination,
        waypoints: ary,
        travelMode: google.maps.TravelMode[transit_type]
      }, function (response, status) {
        if(status === google.maps.DirectionsStatus.OK) {
          display.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      });
    };

    function computeTotalDistance(result) {
      var total = 0;
      var myroute = result.routes[0];

      for(var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
      }
      total = total / 1000;
      document.getElementById('total')
        .innerHTML = total + ' km';
    };


    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');

      //alternative to geolocation goes here ////
    };


    function watch_waypoints() {
      console.log("Watch triggered");
      clear_markers();

      var wpts = directionsDisplay.directions.routes[0].legs[0].via_waypoints;
      console.log(wpts);
      if(wpts.length) {

        for(var i = 0; i < wpts.length; i++) {

          var marker = new google.maps.Marker({
            map: map,
            //    icon: {
            //    path: google.maps.SymbolPath.CIRCLE,
            //  scale: 5
            //   },
            position: new google.maps.LatLng(wpts[i].lat(), wpts[i].lng()),
            title: i.toString()
          });
          waypoint_markers.push(marker);

          marker.addListener('click', function () {
            console.log("clicked");
            infoWindow.setContent("double click to delete this waypoint");
            infoWindow.open(map, this);
          });
          marker.addListener('dblclick', function () {
            console.log("double click");
            marker.setMap(null);
            //  wpts.filter()
            wpts.splice(parseInt(this.title), 1);
            displayRoute(user_origin, user_destination, directionsService, directionsDisplay, wpts);
            directionsDisplay.setOptions({
              preserveViewport: true,
              draggable: true
            });
          });
        }

      }
    }

    function clear_markers() {
      if(waypoint_markers.length) {
        for(var i = 0; i < waypoint_markers.length; i++) {
          waypoint_markers[i].setMap(null);
        }
      };
    };

    $scope.updateMap = function () {
      user_destination = $scope.destination;
      user_origin = $scope.origin;
      //  if( wpts !== "undefined"){
      //      render(user_origin, user_destination, directionsService, directionsDisplay, wpts);
      //  } else{
      directionsService.route({
        origin: user_destination,
        destination: user_origin,
        travelMode: google.maps.TravelMode[transit_type]
      }, function (response, status) {
        if(status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });

    };

  });

}());
