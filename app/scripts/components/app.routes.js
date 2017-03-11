/**
 * Created by crystalneth on 11-Mar-17.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('studyscriptApp')

  // Define routes
    .config(config);

  config.$inject = ['$routeProvider', '$locationProvider'];

  // TODO documentation
  /* @ngInject */
  function config($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true
    });

    $routeProvider
      .when('/', {
        templateUrl: 'scripts/components/landing/landingView.htm'
      })

      .when('/login', {
        templateUrl: 'scripts/components/authentication/authenticationView.htm'
      })

      .when('/order', {
        templateUrl: 'scripts/components/order/orderView.htm'
      })

      .otherwise({
        redirectTo: '/'
      });
  }

})();
