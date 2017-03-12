/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('authentication')

  // Define controllers
    .controller('loginController', LoginController);

  LoginController.$inject = ['$scope', 'AuthenticationService'];

  /* @ngInject */
  function LoginController($scope, AuthenticationService) {
    var self = this;

    self.send = function() {
      AuthenticationService.login(self.email, self.password);
    };
  }

})();
