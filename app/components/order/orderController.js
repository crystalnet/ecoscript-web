/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('orderController', OrderController);

OrderController.$inject = ['$location', 'OrderService', '$timeout', 'PageContextService'];

function OrderController($location, OrderService, $timeout, PageContextService) {
  const self = this;
  self.Order = OrderService;

  self.Order.checkReset();

  PageContextService.headerUrl = 'components/order/orderHeader.htm';

  self.getTemplate = function () {
    let result = '';
    if (self.Order.stage > 7) {
      result = 'components/order/payment/paymentView.htm';
    } else if (self.Order.stage > 5) {
      result = 'components/order/particulars/particularsView.htm';
    } else {
      result = 'components/order/configuration/configurationView.htm';
    }
    return result;
  };
}
