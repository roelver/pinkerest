'use strict';

angular.module('pinkerestApp')
  .factory('AddPinkModal', function ($rootScope, $modal, $http, RefreshService, ProcessService, toastr) {
 

     function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);
  

      return $modal.open({
        templateUrl: 'components/modal/addpinkmodal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }


     // Public API here
    return {
      choice: function(callback) {
        callback = callback || angular.noop;

        return function() {
            var args = Array.prototype.slice.call(arguments);
            var name = args.shift();
            var showModal;

            showModal = openModal({
              modal: {
                dismissable: true,
                title: 'Add your Pinkture',
                text: '',
                me: {},
                imgUrl: '',
                description: '',
                progress: 0,
                notPinkEnough: true,  //Disable buttons
                noImageYet: true,
                setImageSrc: function() {
                      RefreshService.setImageSrc(this.imgUrl);
                      $http.get('/auth/me')
                         .success(function(data) {
                           $rootScope.me = data;
                      });

                      var img = $("#newPink");
                      if (img) {
                        this.setButtons(false, true);
                      }
                },
                setButtons: function(noImageYet, notPinkEnough) {
                  this.noImageYet = noImageYet;
                  this.notPinkEnough = notPinkEnough; // true if pinkness > 30%
                },

                wrapUp: function(filename, obj) {
                    ProcessService.loadedImg(filename);

                    obj.noImageYet = false;
                    obj.notPinkEnough = ProcessService.notPinkEnough(); 
                    if (obj.notPinkEnough) {
                      toastr.warning('Your pinkture is not PINK enough! Try another one.')
                    }
                    $.ajax({
                        url: '/api/pinktures?' + $.param({"filename": filename}),
                        type: 'DELETE',
                          success: function(result) {
                          console.log('Delete: ', result);
                      }                
                    });
                    $rootScope.$apply();
                  },

                analyze: function( )  {
                    var callback = this.wrapUp;
                    var self = this;
                    $http.post("/api/pinktures/store", {myurl: this.imgUrl})
                       .then(function( response ) {
                          var filename = response.data;

                          RefreshService.setImageSrc('/api/pinktures/img/'+filename);
                          setTimeout(callback, 300, filename, self);
                        }, function(err, data) {
                              console.log('Failed', err, data);
                        });
                },
                save: function() {
                    showModal.close();
                    var newPink = {};
                    newPink.title = this.description;
                    newPink.imgUrl = this.imgUrl
                    newPink.pinkScore= ProcessService.getPinkness();
                    newPink.likes= 0;
                    newPink.existing= true;
                    newPink.owner = $rootScope.me;

                   $http.post("/api/pinktures/", newPink)
                       .then(function( response ) {
                           console.log("Pinkture is saved", response);
                           callback();
                    });
                }

              }
            }, 'modal-info');
          };
      }
    } 

});
