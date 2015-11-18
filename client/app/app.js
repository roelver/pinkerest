'use strict';

angular.module('pinkerestApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'satellizer',
  'toastr',
  'wu.masonry'
])
 

  .config(function($authProvider) {
    $authProvider.github({
      clientId: 'a7b1d1bd1b36c146e7e9',
      url: '/auth/github',
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      optionalUrlParams: ['scope'],
      scope: ['user:email'],
      scopeDelimiter: ' ',
      type: '2.0',
      popupOptions: { width: 1020, height: 618 }
    });

    $authProvider.twitter({
      url: '/auth/twitter',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      type: '1.0',
      popupOptions: { width: 495, height: 645 }
    });

    $authProvider.loginUrl = '/auth/local/login';
    $authProvider.signupUrl = '/auth/local/signup';
    $authProvider.unlinkUrl = '/auth/unlink/';

  })

  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

  })

;