/**
 * Created by crystalneth on 22-Mar-17.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('order')

  // Define controllers
    .controller('uploadController', UploadController);

  UploadController.$inject = ['$location', 'UploadService'];

  /* @ngInject */
  function UploadController($location, UploadService) {
    const self = this;

    self.uploadFiles = function(files, errFiles) {
      self.files = files;
      self.errFiles = errFiles;
      angular.forEach(self.files, function(file) {
        UploadService.uploadFile(file);
      });
    };
  }
})();

