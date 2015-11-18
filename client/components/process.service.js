'use strict';

// Methods to refresh the image with JQuery. Placed in a service because it was required in a callback
angular.module('pinkerestApp')
  .factory('ProcessService', function ($rootScope, RefreshService) {

  		var fact = {};

  		 fact.pinkness = 0;

  		 fact.getPinkness = function() {
  		 	return this.pinkness;
  		 };

  		 fact.notPinkEnough = function() {
  		 	return this.pinkness < 30;
  		 };

       fact.loadedImg = function (fname) {
      //     var img= $("#newPink");
          var img= document.getElementById("newPink");
          img.style.display = "inline";

           var canvas = document.createElement('canvas');
           canvas.width = img.naturalWidth;
           canvas.height = img.naturalHeight;
           var ctx = canvas.getContext('2d');
           RefreshService.updateProgress(0);
           RefreshService.updatePink(0);

           ctx.drawImage(img, 0, 0);
           var h = canvas.height;
           var w = canvas.width;
           var imageData = ctx.getImageData(0,0,w, h);
           var data = imageData.data;

           var totalSize = w * h;
           var pinkCounter = 0;
           var perc = Math.floor(data.length/100);
           var percCount = perc;
           var r = 0;
           var g = 0;
           var b = 0;

           for (var i = 0; i < data.length; i += 4) {
                 r = data[i]; // less red
                 g = data[i+1]; // less green
                 b = data[i+2]; // MORE BLUE
                 if (r > 180 && b > 150 && g < b) {
                   pinkCounter++;
                 }
                 if (i > percCount) {
                     percCount += perc;
                     RefreshService.updateProgress(Math.ceil((i/data.length)*1000)/10);
                     RefreshService.updatePink(Math.ceil((pinkCounter/totalSize)*1000)/10);
                 }
           }
           RefreshService.updateProgress(100);

           this.pinkness = Math.ceil((pinkCounter/totalSize)*1000)/10;
           RefreshService.updatePink(this.pinkness);

           $("#analyzeBtn").prop('disabled', false);

       };


      return fact;
   });
