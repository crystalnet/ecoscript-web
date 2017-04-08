/**
 * Created by crystalneth on 22-Mar-17.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('order')

  // Define service
    .service('OrderService', OrderService);

  OrderService.$inject = [];

  function OrderService() {
    const self = this;
    self.order = {
      scripts: [],
      address: {},
      total: 42.00
    };

    self.asdf = function() {
    };
  }
})();
