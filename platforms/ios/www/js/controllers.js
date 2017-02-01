angular.module('app.controllers', [])

.controller('tapBusCtrl', function($scope) {
    $scope.data = {}

})

.controller('mapCtrl', function($scope, $state, $cordovaGeolocation) {

    $scope.data = {}

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        google.maps.event.addListenerOnce($scope.map, 'idle', function(){

            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

            var infoWindow = new google.maps.InfoWindow({
                content: "Here I am!"
            });

            google.maps.event.addListener(marker, "click", function(){
                infoWindow.open($scope.map, marker);
            });

        });

    }, function(error) {
        console.log("Could not get location");
    });


})

.controller('placesNearbyCtrl', function($scope, nfcService) {
    $scope.data = {}

    $scope.tag = nfcService.tag;
    
    $scope.clear = function() {
        nfcService.clearTag();
    };
})
