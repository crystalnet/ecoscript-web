/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('authentication')

// Define controllers
  .controller('registerController', RegisterController);

RegisterController.$inject = ['$scope', 'AuthenticationService'];

// TODO docu
function RegisterController($scope, AuthenticationService) {
  var self = this;

  self.send = function() {
    AuthenticationService.register(self.email, self.password);
  };
}
