/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('order')

  // Define controllers
    .controller('orderController', OrderController);

  OrderController.$inject = ['$location', 'Upload', '$timeout'];

  /* @ngInject */
  function OrderController($location, Upload) {
    var self = this;

    self.uploadFiles = function(files, errFiles) {
      self.files = files;
      self.errFiles = errFiles;
      angular.forEach(self.files, function (file) {
        file.upload = Upload.upload({
          url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
          data: {file: file}
        });

        file.upload.then(function(response) {
          //$timeout(function() {
            file.result = response.data;
          //});
        }, function(response) {
          if (response.status > 0)
            self.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {
          file.progress = Math.min(100, parseInt(100.0 *
            evt.loaded / evt.total));
        });
      });
    }
  }

})();
