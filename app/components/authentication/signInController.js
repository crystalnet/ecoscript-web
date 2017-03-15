/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('authentication')

  // Define controllers
    .controller('signInController', signInController);

  signInController.$inject = ['$scope', 'AuthenticationService'];

  /* @ngInject */
  function signInController($scope, AuthenticationService) {
    var self = this;

    self.googleSignIn = function() {
      AuthenticationService.googleSignIn();
    };

    self.facebookSignIn = function() {
      AuthenticationService.facebookSignIn();
    };

    self.send = function() {
      AuthenticationService.signIn(self.email, self.password);
    };
  }

})();
