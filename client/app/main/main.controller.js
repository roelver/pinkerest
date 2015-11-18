'use strict';

angular.module('pinkerestApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $auth, AddPinkModal) {
 
    $rootScope.isLoggedIn = $auth.isAuthenticated;

    $scope.items = [];

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then($scope.getMe);
    };

    $scope.getMe = function() {
      $http.get('/auth/me')
        .success(function(data) {
          $rootScope.me = data;
      });
    };

    $scope.addPink = function() {
       var mod = AddPinkModal.choice( $scope.getData);
       mod();
    };

    $scope.deletePink = function(idx) {
      var id = $scope.items[idx]._id;
      $http.delete('/api/pinktures/'+id)
        .success(function(data) {
           $scope.items.splice(idx,1);
      });

    };

    $scope.myImage = function(pinkture) {
       if ($rootScope.me) {
           return pinkture.owner === $rootScope.me._id;
         }
    };

    $scope.getData = function() {
      $http.get('/api/pinktures/')
        .success(function(data) {
          $scope.items = data;
      });

    }

    if ($rootScope.isLoggedIn()) {
      $scope.getMe();
    };

    $scope.getData();
    
  });
