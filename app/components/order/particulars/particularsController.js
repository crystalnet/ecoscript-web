/**
 * Created by dominik on 07/06/2017.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('particularsController', particularController);

particularController.$inject = ['$location', 'OrderService', '$timeout', 'PageContextService'];

function particularController($location, OrderService, $timeout) {
  const self = this;
  self.order = OrderService;

  self.toggle = function(element) {
    switch (element) {
      case 'login':
        self.login = true;
        self.register = false;
        break;
      case 'register':
        self.login = false;
        self.register = true;
        break;
      default:
        self.login = false;
        self.register = false;
    }
  };
}
