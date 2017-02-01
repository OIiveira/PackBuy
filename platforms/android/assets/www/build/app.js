// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives',  'nfcFilters'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

angular.module('app.controllers', [])

.controller('tapBusCtrl', function($scope) {
    $scope.data = {};
})

.controller('mapCtrl', function($scope, $filter, $state, $cordovaGeolocation, nfcService) {

    $scope.data = {};

    $scope.tag = nfcService.tag;

    $scope.clear = function() {
        nfcService.clearTag();
    };

    $scope.watch($scope.tag, function(){
      alert($scope.tag);
    });

    // if($scope.tag){
    //   var latLngList = $filter('testf')($scope.tag.ndefMessage[0]);
    //   alert(latLngList);
    //   $scope.cordovaLocation(latLngList);
    // }

    // var options = {timeout: 10000, enableHighAccuracy: true};

    // $scope.cordovaLocation = function(latLngList){
    //   $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    //
    //       //var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //       var latLng = new google.maps.LatLng(latLngList[0], latLngList[1]);
    //
    //       var mapOptions = {
    //           center: latLng,
    //           zoom: 15,
    //           mapTypeId: google.maps.MapTypeId.ROADMAP
    //       };
    //
    //       $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //
    //       google.maps.event.addListenerOnce($scope.map, 'idle', function(){
    //
    //           var marker = new google.maps.Marker({
    //               map: $scope.map,
    //               animation: google.maps.Animation.DROP,
    //               position: latLng
    //           });
    //
    //           var infoWindow = new google.maps.InfoWindow({
    //               content: "Here I am!"
    //           });
    //
    //           google.maps.event.addListener(marker, "click", function(){
    //               infoWindow.open($scope.map, marker);
    //           });
    //
    //       });
    //
    //   }, function(error) {
    //       console.log("Could not get location");
    //   });
    //
    // }


})

.controller('placesNearbyCtrl', function($scope, nfcService) {
    $scope.data = {};

    $scope.tag = nfcService.tag;

    $scope.clear = function() {
        nfcService.clearTag();
    };
});

angular.module('app.directives', [])

.directive('blankDirective', [function(){

}]);


// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('nfcFilters', [])
    .filter('bytesToHexString', function() {
        return function (input) {
            if (window.nfc) {
                return nfc.bytesToHexString(input);
            } else {
                return input;
            }
        };
    })

    .filter('bytesToString', function() {
        return function(input) {
            if (window.nfc) {
                return nfc.bytesToString(input);
            } else {
                return input;
            }
        };
    })

    .filter('tnfToString', function() {

        function tnfToString(tnf) {
            var value = tnf;

            switch (tnf) {
                case ndef.TNF_EMPTY:
                    value = "Empty";
                    break;
                case ndef.TNF_WELL_KNOWN:
                    value = "Well Known";
                    break;
                case ndef.TNF_MIME_MEDIA:
                    value = "Mime Media";
                    break;
                case ndef.TNF_ABSOLUTE_URI:
                    value = "Absolute URI";
                    break;
                case ndef.TNF_EXTERNAL_TYPE:
                    value = "External";
                    break;
                case ndef.TNF_UNKNOWN:
                    value = "Unknown";
                    break;
                case ndef.TNF_UNCHANGED:
                    value = "Unchanged";
                    break;
                case ndef.TNF_RESERVED:
                    value = "Reserved";
                    break;
            }
            return value;
        }

        return function(input) {

            if (window.ndef) {
                return tnfToString(input);
            } else {
                return input;
            }

        };
    })

    .filter('testf', function(){
      function testf(record){
        var payload,
            recordType = nfc.bytesToString(record.type);

        if (recordType === "T") {
            payload = ndef.textHelper.decodePayload(record.payload);

        } else if (recordType === "U") {
            payload = ndef.uriHelper.decodePayload(record.payload);

        } else {

            var printableData = record.payload.map(function(i) {
                if (i <= 0x1F) {
                    return 0x2e; // unprintable, replace with "."
                } else {
                    return i;
                }
            });

            payload = nfc.bytesToString(printableData);
        }

        var latLngInput = payload.replace(":",",").split(",");
        var latLng = [];

        latLng[0] = latLngInput[1];
        latLng[1] = latLngInput[2];

        return latLng;
      }

      return function(input) {
          if (window.nfc) {
              return testf(input);
          } else {
              return input.payload;
          }
      };
    })

    .filter('decodePayload', function() {

        function decodePayload(record) {

            var payload,
                recordType = nfc.bytesToString(record.type);

            if (recordType === "T") {
                payload = ndef.textHelper.decodePayload(record.payload);

            } else if (recordType === "U") {
                payload = ndef.uriHelper.decodePayload(record.payload);

            } else {

                // we don't know how to translate this type, try and print it out.
                // your app should know how to process tags it receives

                var printableData = record.payload.map(function(i) {
                    if (i <= 0x1F) {
                        return 0x2e; // unprintable, replace with "."
                    } else {
                        return i;
                    }
                });

                payload = nfc.bytesToString(printableData);
            }

            return payload;
        }

        return function(input) {

            if (window.nfc) {
                return decodePayload(input);
            } else {
                return input.payload;
            }

        };
    });

angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('menu.tapBus', {
    url: '/home',
    views: {
      'side-menu21': {
        templateUrl: 'templates/tapBus.html',
        controller: 'tapBusCtrl'
      }
    }
  })

  .state('menu.map', {
    url: '/map',
    views: {
      'side-menu21': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
      }
    }
  })

  .state('menu.placesNearby', {
    url: '/pn',
    views: {
      'side-menu21': {
        templateUrl: 'templates/placesNearby.html',
        controller: 'placesNearbyCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  });

$urlRouterProvider.otherwise('/side-menu21/home');

});

angular.module('app.services', [])

// nfc service
.factory('nfcService', function($rootScope, $ionicPlatform){
  var tag = {};

  $ionicPlatform.ready(function(){
    nfc.addNdefListener(function(nfcEvent){
      console.log(JSON.stringify(nfcEvent.tag, null, 4));
      $rootScope.$apply(function(){
        angular.copy(nfcEvent.tag, tag);
      });
    }, function () {
      console.log("Listening for NDEF Tags.");
    }, function (reason) {
      alert("Error adding NFC Listener " + reason);
    });
  });

  return {
    tag: tag,
    clearTag: function () {
      angular.copy({}, this.tag);
    },
    subscribe: function(scope, callback) {
        var handler = $rootScope.$on('nfcTagEvent', callback);
        scope.$on('$destroy', handler);
    },
    notify: function() {
      $rootScope.$emit('nfcTagEvent');
    }
  };

})

.service('BlankService', [function(){

}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwiZGlyZWN0aXZlcy5qcyIsImZpbHRlcnMuanMiLCJyb3V0ZXMuanMiLCJzZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbi8vICdzdGFydGVyLnNlcnZpY2VzJyBpcyBmb3VuZCBpbiBzZXJ2aWNlcy5qc1xuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG5hbmd1bGFyLm1vZHVsZSgnYXBwJywgWydpb25pYycsICduZ0NvcmRvdmEnLCAnYXBwLmNvbnRyb2xsZXJzJywgJ2FwcC5yb3V0ZXMnLCAnYXBwLnNlcnZpY2VzJywgJ2FwcC5kaXJlY3RpdmVzJywgICduZmNGaWx0ZXJzJ10pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFtdKVxuXG4uY29udHJvbGxlcigndGFwQnVzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICRzY29wZS5kYXRhID0ge307XG59KVxuXG4uY29udHJvbGxlcignbWFwQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGZpbHRlciwgJHN0YXRlLCAkY29yZG92YUdlb2xvY2F0aW9uLCBuZmNTZXJ2aWNlKSB7XG5cbiAgICAkc2NvcGUuZGF0YSA9IHt9O1xuXG4gICAgJHNjb3BlLnRhZyA9IG5mY1NlcnZpY2UudGFnO1xuXG4gICAgJHNjb3BlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG5mY1NlcnZpY2UuY2xlYXJUYWcoKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLndhdGNoKCRzY29wZS50YWcsIGZ1bmN0aW9uKCl7XG4gICAgICBhbGVydCgkc2NvcGUudGFnKTtcbiAgICB9KTtcblxuICAgIC8vIGlmKCRzY29wZS50YWcpe1xuICAgIC8vICAgdmFyIGxhdExuZ0xpc3QgPSAkZmlsdGVyKCd0ZXN0ZicpKCRzY29wZS50YWcubmRlZk1lc3NhZ2VbMF0pO1xuICAgIC8vICAgYWxlcnQobGF0TG5nTGlzdCk7XG4gICAgLy8gICAkc2NvcGUuY29yZG92YUxvY2F0aW9uKGxhdExuZ0xpc3QpO1xuICAgIC8vIH1cblxuICAgIC8vIHZhciBvcHRpb25zID0ge3RpbWVvdXQ6IDEwMDAwLCBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWV9O1xuXG4gICAgLy8gJHNjb3BlLmNvcmRvdmFMb2NhdGlvbiA9IGZ1bmN0aW9uKGxhdExuZ0xpc3Qpe1xuICAgIC8vICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgLy9cbiAgICAvLyAgICAgICAvL3ZhciBsYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XG4gICAgLy8gICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0TG5nTGlzdFswXSwgbGF0TG5nTGlzdFsxXSk7XG4gICAgLy9cbiAgICAvLyAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcbiAgICAvLyAgICAgICAgICAgY2VudGVyOiBsYXRMbmcsXG4gICAgLy8gICAgICAgICAgIHpvb206IDE1LFxuICAgIC8vICAgICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQXG4gICAgLy8gICAgICAgfTtcbiAgICAvL1xuICAgIC8vICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcbiAgICAvL1xuICAgIC8vICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyT25jZSgkc2NvcGUubWFwLCAnaWRsZScsIGZ1bmN0aW9uKCl7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgIC8vICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxuICAgIC8vICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICAvLyAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsYXRMbmdcbiAgICAvLyAgICAgICAgICAgfSk7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgLy8gICAgICAgICAgICAgICBjb250ZW50OiBcIkhlcmUgSSBhbSFcIlxuICAgIC8vICAgICAgICAgICB9KTtcbiAgICAvL1xuICAgIC8vICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsIFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3Blbigkc2NvcGUubWFwLCBtYXJrZXIpO1xuICAgIC8vICAgICAgICAgICB9KTtcbiAgICAvL1xuICAgIC8vICAgICAgIH0pO1xuICAgIC8vXG4gICAgLy8gICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IGdldCBsb2NhdGlvblwiKTtcbiAgICAvLyAgIH0pO1xuICAgIC8vXG4gICAgLy8gfVxuXG5cbn0pXG5cbi5jb250cm9sbGVyKCdwbGFjZXNOZWFyYnlDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBuZmNTZXJ2aWNlKSB7XG4gICAgJHNjb3BlLmRhdGEgPSB7fTtcblxuICAgICRzY29wZS50YWcgPSBuZmNTZXJ2aWNlLnRhZztcblxuICAgICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBuZmNTZXJ2aWNlLmNsZWFyVGFnKCk7XG4gICAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pXG5cbi5kaXJlY3RpdmUoJ2JsYW5rRGlyZWN0aXZlJywgW2Z1bmN0aW9uKCl7XG5cbn1dKTtcblxuIiwiLy8gKGMpIDIwMTQgRG9uIENvbGVtYW5cbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbmFuZ3VsYXIubW9kdWxlKCduZmNGaWx0ZXJzJywgW10pXG4gICAgLmZpbHRlcignYnl0ZXNUb0hleFN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICBpZiAod2luZG93Lm5mYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZmMuYnl0ZXNUb0hleFN0cmluZyhpbnB1dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KVxuXG4gICAgLmZpbHRlcignYnl0ZXNUb1N0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cubmZjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5mYy5ieXRlc1RvU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pXG5cbiAgICAuZmlsdGVyKCd0bmZUb1N0cmluZycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGZ1bmN0aW9uIHRuZlRvU3RyaW5nKHRuZikge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdG5mO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHRuZikge1xuICAgICAgICAgICAgICAgIGNhc2UgbmRlZi5UTkZfRU1QVFk6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXCJFbXB0eVwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIG5kZWYuVE5GX1dFTExfS05PV046XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXCJXZWxsIEtub3duXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgbmRlZi5UTkZfTUlNRV9NRURJQTpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBcIk1pbWUgTWVkaWFcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBuZGVmLlRORl9BQlNPTFVURV9VUkk6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXCJBYnNvbHV0ZSBVUklcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBuZGVmLlRORl9FWFRFUk5BTF9UWVBFOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiRXh0ZXJuYWxcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBuZGVmLlRORl9VTktOT1dOOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiVW5rbm93blwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIG5kZWYuVE5GX1VOQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBcIlVuY2hhbmdlZFwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIG5kZWYuVE5GX1JFU0VSVkVEOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiUmVzZXJ2ZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcblxuICAgICAgICAgICAgaWYgKHdpbmRvdy5uZGVmKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRuZlRvU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgfSlcblxuICAgIC5maWx0ZXIoJ3Rlc3RmJywgZnVuY3Rpb24oKXtcbiAgICAgIGZ1bmN0aW9uIHRlc3RmKHJlY29yZCl7XG4gICAgICAgIHZhciBwYXlsb2FkLFxuICAgICAgICAgICAgcmVjb3JkVHlwZSA9IG5mYy5ieXRlc1RvU3RyaW5nKHJlY29yZC50eXBlKTtcblxuICAgICAgICBpZiAocmVjb3JkVHlwZSA9PT0gXCJUXCIpIHtcbiAgICAgICAgICAgIHBheWxvYWQgPSBuZGVmLnRleHRIZWxwZXIuZGVjb2RlUGF5bG9hZChyZWNvcmQucGF5bG9hZCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmRUeXBlID09PSBcIlVcIikge1xuICAgICAgICAgICAgcGF5bG9hZCA9IG5kZWYudXJpSGVscGVyLmRlY29kZVBheWxvYWQocmVjb3JkLnBheWxvYWQpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBwcmludGFibGVEYXRhID0gcmVjb3JkLnBheWxvYWQubWFwKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8PSAweDFGKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAweDJlOyAvLyB1bnByaW50YWJsZSwgcmVwbGFjZSB3aXRoIFwiLlwiXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBheWxvYWQgPSBuZmMuYnl0ZXNUb1N0cmluZyhwcmludGFibGVEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsYXRMbmdJbnB1dCA9IHBheWxvYWQucmVwbGFjZShcIjpcIixcIixcIikuc3BsaXQoXCIsXCIpO1xuICAgICAgICB2YXIgbGF0TG5nID0gW107XG5cbiAgICAgICAgbGF0TG5nWzBdID0gbGF0TG5nSW5wdXRbMV07XG4gICAgICAgIGxhdExuZ1sxXSA9IGxhdExuZ0lucHV0WzJdO1xuXG4gICAgICAgIHJldHVybiBsYXRMbmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgIGlmICh3aW5kb3cubmZjKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0ZXN0ZihpbnB1dCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGlucHV0LnBheWxvYWQ7XG4gICAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KVxuXG4gICAgLmZpbHRlcignZGVjb2RlUGF5bG9hZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGZ1bmN0aW9uIGRlY29kZVBheWxvYWQocmVjb3JkKSB7XG5cbiAgICAgICAgICAgIHZhciBwYXlsb2FkLFxuICAgICAgICAgICAgICAgIHJlY29yZFR5cGUgPSBuZmMuYnl0ZXNUb1N0cmluZyhyZWNvcmQudHlwZSk7XG5cbiAgICAgICAgICAgIGlmIChyZWNvcmRUeXBlID09PSBcIlRcIikge1xuICAgICAgICAgICAgICAgIHBheWxvYWQgPSBuZGVmLnRleHRIZWxwZXIuZGVjb2RlUGF5bG9hZChyZWNvcmQucGF5bG9hZCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVjb3JkVHlwZSA9PT0gXCJVXCIpIHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gbmRlZi51cmlIZWxwZXIuZGVjb2RlUGF5bG9hZChyZWNvcmQucGF5bG9hZCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyB3ZSBkb24ndCBrbm93IGhvdyB0byB0cmFuc2xhdGUgdGhpcyB0eXBlLCB0cnkgYW5kIHByaW50IGl0IG91dC5cbiAgICAgICAgICAgICAgICAvLyB5b3VyIGFwcCBzaG91bGQga25vdyBob3cgdG8gcHJvY2VzcyB0YWdzIGl0IHJlY2VpdmVzXG5cbiAgICAgICAgICAgICAgICB2YXIgcHJpbnRhYmxlRGF0YSA9IHJlY29yZC5wYXlsb2FkLm1hcChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDw9IDB4MUYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAweDJlOyAvLyB1bnByaW50YWJsZSwgcmVwbGFjZSB3aXRoIFwiLlwiXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcGF5bG9hZCA9IG5mYy5ieXRlc1RvU3RyaW5nKHByaW50YWJsZURhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuXG4gICAgICAgICAgICBpZiAod2luZG93Lm5mYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGVQYXlsb2FkKGlucHV0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0LnBheWxvYWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgW10pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gIC8vIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAvLyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgJHN0YXRlUHJvdmlkZXJcblxuXG5cbiAgICAgIC5zdGF0ZSgnbWVudS50YXBCdXMnLCB7XG4gICAgdXJsOiAnL2hvbWUnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnc2lkZS1tZW51MjEnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3RhcEJ1cy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3RhcEJ1c0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIC5zdGF0ZSgnbWVudS5tYXAnLCB7XG4gICAgdXJsOiAnL21hcCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdzaWRlLW1lbnUyMSc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbWFwLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnbWFwQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgLnN0YXRlKCdtZW51LnBsYWNlc05lYXJieScsIHtcbiAgICB1cmw6ICcvcG4nLFxuICAgIHZpZXdzOiB7XG4gICAgICAnc2lkZS1tZW51MjEnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BsYWNlc05lYXJieS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3BsYWNlc05lYXJieUN0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIC5zdGF0ZSgnbWVudScsIHtcbiAgICB1cmw6ICcvc2lkZS1tZW51MjEnLFxuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21lbnUuaHRtbCcsXG4gICAgYWJzdHJhY3Q6dHJ1ZVxuICB9KTtcblxuJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3NpZGUtbWVudTIxL2hvbWUnKTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pXG5cbi8vIG5mYyBzZXJ2aWNlXG4uZmFjdG9yeSgnbmZjU2VydmljZScsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRpb25pY1BsYXRmb3JtKXtcbiAgdmFyIHRhZyA9IHt9O1xuXG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgbmZjLmFkZE5kZWZMaXN0ZW5lcihmdW5jdGlvbihuZmNFdmVudCl7XG4gICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShuZmNFdmVudC50YWcsIG51bGwsIDQpKTtcbiAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCl7XG4gICAgICAgIGFuZ3VsYXIuY29weShuZmNFdmVudC50YWcsIHRhZyk7XG4gICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkxpc3RlbmluZyBmb3IgTkRFRiBUYWdzLlwiKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBhbGVydChcIkVycm9yIGFkZGluZyBORkMgTGlzdGVuZXIgXCIgKyByZWFzb24pO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHRhZzogdGFnLFxuICAgIGNsZWFyVGFnOiBmdW5jdGlvbiAoKSB7XG4gICAgICBhbmd1bGFyLmNvcHkoe30sIHRoaXMudGFnKTtcbiAgICB9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24oc2NvcGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBoYW5kbGVyID0gJHJvb3RTY29wZS4kb24oJ25mY1RhZ0V2ZW50JywgY2FsbGJhY2spO1xuICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgaGFuZGxlcik7XG4gICAgfSxcbiAgICBub3RpZnk6IGZ1bmN0aW9uKCkge1xuICAgICAgJHJvb3RTY29wZS4kZW1pdCgnbmZjVGFnRXZlbnQnKTtcbiAgICB9XG4gIH07XG5cbn0pXG5cbi5zZXJ2aWNlKCdCbGFua1NlcnZpY2UnLCBbZnVuY3Rpb24oKXtcblxufV0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
