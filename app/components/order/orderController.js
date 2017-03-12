/**
 * Created by dominik on 10/03/2017.
 */

(function () {
  'use strict';

  // Get the module
  angular.module('order')

  // Define controllers
    .controller('orderController', OrderController);

  OrderController.$inject = ['$location'];

  /* @ngInject */
  function OrderController($location) {
    var self = this;
  }

})();
