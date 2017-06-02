/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('studyscriptApp')

  // Define controllers
    .controller('landingController', LandingController);

  LandingController.$inject = ['$location', '$anchorScroll'];

  /* @ngInject */
  function LandingController($location, $anchorScroll) {
    const self = this;

    self.order = function() {
      $location.path('/order');
    };
  }
})();
