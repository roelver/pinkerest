'use strict';

angular.module('pinkerestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/add', {
        templateUrl: 'app/main/add.html',
        controller: 'AddCtrl'
      });
  });