/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('studyscriptApp')

  // Define controllers
    .controller('navigationController', NavigationController);

  NavigationController.$inject = ['$location'];

  /* @ngInject */
  function NavigationController($location) {
    var self = this;

    self.authenticate = function() {
      $location.path('/login');
    };

    self.home = function() {
      $location.path('/');
    };
  }
})();
