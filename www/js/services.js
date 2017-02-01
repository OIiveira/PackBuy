angular.module('app.services', [])

// nfc service
.factory('nfcService', function($rootScope, $ionicPlatform){
  var tag = {};

  $ionicPlatform.ready(function(){
    nfc.addNdefListener(function(nfcEvent){
      console.log(JSON.stringify(nfcEvent.tag, null, 4));

      angular.copy(nfcEvent.tag, tag);
      broadcastTag(tag);
    }, function () {
      console.log("Listening for NDEF Tags.");
    }, function (reason) {
      alert("Error adding NFC Listener " + reason);
    });
  });

  function broadcastTag(tag) {
    $rootScope.$emit('new.tag', tag);
  }

  return {
    tag: function(){return tag;},
    clearTag: function () {
      angular.copy({}, this.tag);
    }
  };

})

.service('BlankService', [function(){

}]);
