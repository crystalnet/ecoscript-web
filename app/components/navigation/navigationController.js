/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('scriptecoApp')

  // Define controllers
    .controller('navigationController', NavigationController);

  NavigationController.$inject = ['$location', '$anchorScroll', 'AuthenticationService'];

  /* @ngInject */
  function NavigationController($location, $anchorScroll, AuthenticationService) {
    const self = this;

    self.signedIn = function() {
      return Boolean(AuthenticationService.user);
    };

    self.signOut = function() {
      return AuthenticationService.signOut();
    };

    self.scrollTo = function(path, hash) {
      $location.path(path);
      $location.hash(hash);
      $anchorScroll();
    };
  }
})();
