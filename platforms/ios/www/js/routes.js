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
  })

$urlRouterProvider.otherwise('/side-menu21/home')

  

});