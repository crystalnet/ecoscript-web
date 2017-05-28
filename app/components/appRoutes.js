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
        templateUrl: 'components/landing/landingView.htm'
      })

      .when('/login', {
        templateUrl: 'components/authentication/authenticationView.htm'
      })

      .when('/order', {
        templateUrl: 'components/order/configuration/configurationView.htm'
      })

      .otherwise({
        redirectTo: '/'
      });
  }
})();
