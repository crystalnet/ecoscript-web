/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('order')

  // Define controllers
    .controller('orderController', OrderController);

  OrderController.$inject = ['$location', 'UploadService'];

  /* @ngInject */
  function OrderController($location, UploadService) {
    const self = this;

    self.uploadFiles = function (files, errFiles) {
      self.files = files;
      self.errFiles = errFiles;
      angular.forEach(self.files, function (file) {
        UploadService.uploadFile(file);
      });
    };
  }

})();
