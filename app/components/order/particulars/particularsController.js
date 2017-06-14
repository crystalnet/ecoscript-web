/**
 * Created by dominik on 07/06/2017.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('particularsController', particularController);

particularController.$inject = ['$location', 'OrderService', '$timeout', 'PageContextService', 'AuthenticationService'];

function particularController($location, OrderService, $timeout, PageContextService, AuthenticationService) {
  const self = this;
  const Authentication = AuthenticationService;
  self.order = OrderService;

  self.toggle = function (element) {
    switch (element) {
      case 'login':
        self.createNewAccount = false;
        break;
      case 'register':
        self.createNewAccount = true;
        break;
      default:
        self.createNewAccount = true;
    }
  };

  self.register = function () {
    Authentication.register(self.credentials.email, self.credentials.password);
  };

  self.googleRegister = function () {
    Authentication.googleRegister();
  };

  self.facebookRegister = function () {
    Authentication.facebookRegister();
  };

  self.signIn = function () {
    Authentication.signIn(self.credentials.email, self.credentials.password)
      .then(function () {
        self.order.next();
      });
  };

  self.googleSignIn = function () {
    Authentication.googleSignIn().then(function () {
      self.order.next();
    });
  };

  self.facebookSignIn = function () {
    Authentication.facebookSignIn()
      .then(function () {
        self.order.next();
      });
  };
}
