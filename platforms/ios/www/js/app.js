// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives',  'nfcFilters'])

//angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'uiGmapgoogle-maps'])

// //Google Maps SDK
// angular.module('app').config(function(uiGmapGoogleMapApiProvider) {
//     uiGmapGoogleMapApiProvider.configure({
//         key: 'AIzaSyBpIcsjVij2iNxGzwB0uJdnKhI4hNN8QUA',
//         v: '3.17',
//         libraries: 'weather,geometry,visualization'
//     });
// });

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
})

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
    }
  };

});
