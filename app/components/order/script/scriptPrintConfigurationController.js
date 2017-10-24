/**
 * Created by crystalneth on 24-Oct-17.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('scriptPrintConfigurationController', ScriptPrintConfigurationController);

ScriptPrintConfigurationController.$inject = ['$location', 'OrderService', '$timeout', 'PageContextService', '$scope'];

function ScriptPrintConfigurationController($location, OrderService, $timeout, $scope) {
  const self = this;
  self.script = OrderService.scripts[0];

  if (!self.script.prices) {
    OrderService.getPrices();
  }

  self.displayPrice = function () {
    if (self.script.prices) {
      return self.script.prices[self.script.configuration.color.value][self.script.configuration.twoSided.value][self.script.configuration.pagesPerSide.value].toFixed(2);
    } else {
      return '';
    }
  };
}
