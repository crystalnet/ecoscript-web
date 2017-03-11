/**
 * Created by crystalneth on 11-Mar-17.
 */

(function () {
  'use strict';

  // Get the module
  angular.module('studyscriptApp')

  // Define routes
    .config(config);

  config.$inject = ['$routeProvider', '$locationProvider'];

  /* @ngInject */
  function config($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true
      });

    $routeProvider
      .when('/', {
        templateUrl: 'scripts/components/landing/landingView.htm'
      })

      .otherwise({
        templateUrl: 'scripts/components/landing/landingView.htm'
      });
  }
})();


