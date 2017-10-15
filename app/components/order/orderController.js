/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('orderController', OrderController);

OrderController.$inject = ['$location', 'OrderService', '$timeout', 'PageContextService', '$scope'];

function OrderController($location, OrderService, $timeout, PageContextService, $scope) {
  const self = this;
  self.Order = OrderService;

  PageContextService.headerUrl = 'components/order/orderHeader.htm';
  PageContextService.footerUrl = 'components/order/orderFooter.htm';

  //self.Order.initialize();

  if (document.querySelector('#orderProgress')) {
    document.querySelector('#orderProgress').addEventListener('mdl-componentupgraded', function() {
      this.MaterialProgress.setProgress(self.Order.stage * 100 / self.Order.orderSteps.length);
    });
  }

  $scope.$watch(function() {
    return self.Order.stage;
  }, function (newVal, oldVal) {
    let progressbar = document.querySelector('#orderProgress');
    if (progressbar && progressbar.MaterialProgress) {
      document.querySelector('#orderProgress').MaterialProgress.setProgress(self.Order.stage * 100 / self.Order.orderSteps.length);
    }
  });

  self.getTemplate = function () {
    return self.Order.orderSteps[self.Order.stage - 1];
  };

  self.price = function() {
    return self.Order.total;
  };
}
