/**
 * Created by crystalneth on 24/10/2017.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('scriptColorSelectionController', ScriptColorSelectionController);

ScriptColorSelectionController.$inject = ['$location', 'OrderService', '$timeout', 'PageContextService', '$scope'];

function ScriptColorSelectionController($location, OrderService, $timeout, $scope) {
  const self = this;

  if (!OrderService.scripts[0].prices) {
    OrderService.getPrices();
  }
}
