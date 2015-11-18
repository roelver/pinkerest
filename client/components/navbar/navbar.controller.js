'use strict';

angular.module('pinkerestApp')
  .controller('NavbarCtrl', function ($scope, $location, $auth, toastr) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.logout = function() {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
          toastr.info('You have been logged out');
          $location.path('/');
      });
      
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

  });