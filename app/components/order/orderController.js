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

  //self.Order.initialize();

  self.progress = function () {
    document.querySelector('#orderProgress').addEventListener('mdl-componentupgraded', function () {
      this.MaterialProgress.setProgress((self.Order.stage / self.Order.orderSteps.length).toFixed(2));
    });
    return (self.Order.stage / self.Order.orderSteps.length).toFixed(2);
  };

  // self.$watch('stage', function (newVal, oldVal) {
  //   console.log(newVal, oldVal);
  //   document.querySelector('#orderProgress').addEventListener('mdl-componentupgraded', function () {
  //     this.MaterialProgress.setProgress((self.Order.stage / self.Order.orderSteps.length).toFixed(2));
  //   });
  // });

  PageContextService.headerUrl = 'components/order/orderHeader.htm';
  PageContextService.footerUrl = 'components/order/orderFooter.htm';

  self.getTemplate = function () {
    return self.Order.orderSteps[self.Order.stage - 1];
  };
}
