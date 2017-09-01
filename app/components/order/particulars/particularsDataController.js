/**
 * Created by crystalneth on 01-Sep-17.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('particularsDataController', ParticularsDataController);

ParticularsDataController.$inject = ['PaymentService', 'OrderService'];

function ParticularsDataController(PaymentService, OrderService) {
  const self = this;

  PaymentService.create();
}
