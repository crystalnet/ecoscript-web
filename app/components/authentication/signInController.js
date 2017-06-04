/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('authentication')

// Define controllers
  .controller('signInController', signInController);

signInController.$inject = ['AuthenticationService'];

/* @ngInject */
function signInController(AuthenticationService) {
  const self = this;

  self.googleSignIn = function () {
    AuthenticationService.googleSignIn();
  };

  self.facebookSignIn = function () {
    AuthenticationService.facebookSignIn();
  };

  self.send = function () {
    AuthenticationService.signIn(self.email, self.password);
  };
}
