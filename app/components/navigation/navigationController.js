/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('studyscriptApp')

  // Define controllers
    .controller('navigationController', NavigationController);

  NavigationController.$inject = ['$location', '$anchorScroll'];

  /* @ngInject */
  function NavigationController($location, $anchorScroll) {
    const self = this;

    self.scrollTo = function(path, hash) {
      $location.path(path);
      $location.hash(hash);
      $anchorScroll();
    };
  }
})();
