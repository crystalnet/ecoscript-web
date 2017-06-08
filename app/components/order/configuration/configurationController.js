/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('configurationController', ConfigurationController);

ConfigurationController.$inject = ['$location', 'OrderService', '$timeout', 'PageContextService'];

function ConfigurationController($location, OrderService, $timeout) {
  const self = this;
  self.order = OrderService;

  if (self.order.scripts.length === 0) {
    $timeout(function () {
      angular.element('#uploadButton').triggerHandler('click');
    }, 0);
  }

  self.uploadFiles = function (files, errFiles) {
    self.errFiles = errFiles;
    self.files = files;

    angular.forEach(files, function (file) {
      self.order.addScript(file)
        .then(function (result) {
          if (self.order.scripts.length > 0) {
            self.next();
          }
        }, function (error) {
          self.errFiles.push(file);
          console.log('error uploading file');
        }, function (notification) {
          file.progress = notification;
          console.log(notification);
        });
    });
  };
}
