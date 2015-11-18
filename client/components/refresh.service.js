'use strict';

// Methods to refresh the image with JQuery. Placed in a service because it was required in a callback
angular.module('pinkerestApp')
  .factory('RefreshService', function ($rootScope) {

  		var fact = {};

       fact.setImageSrc = function(imgUrl) {
            $("#newPink").attr("src", imgUrl);
             this.updateProgress(0);
             this.updatePink(0);
       };

       fact.updateProgress = function(val) {
         $('#progressbar').attr("aria-valuenow", val);
         $('#progressbar').attr("style", "width: "+val+"%");
         $('#progressbar').html(val+"%");
       };

       fact.updatePink = function(val) {
           $('#pinkbar').attr("aria-valuenow", val);
           $('#pinkbar').attr("style", "width: "+val+"%");
           $('#pinkbar').html(val+"%");
       };

      return fact;
   });
