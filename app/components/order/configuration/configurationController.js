/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('configurationController', ConfigurationController);

ConfigurationController.$inject = ['$location', 'OrderService', '$timeout'];

/* @ngInject */
function ConfigurationController($location, OrderService, $timeout) {
  const self = this;
  self.order = OrderService;
  self.stage = 1;

  self.console = function () {
    console.log(self.order);
  };

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
          console.log(result);

          if (self.order.scripts.length > 0) {

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

  self.next = function () {
    // self.validateInputs();
    self.order.update();
    self.stage = Math.min(self.stage + 1, 5);
  };

  self.previous = function () {
    // self.validateInputs();
    self.order.update();
    self.stage = Math.max(self.stage - 1, 1);
  };

  self.validateInputs = function () {
    const isScriptUploaded = self.order.scripts.length > 0;
    const isTitleSelected = Boolean(self.order.scripts[0].configuration.title);
    const isPlanValid = self.order.plans.indexOf(self.order.scripts[0].configuration.plan) > -1;
    const isColorValid = self.order.colors.indexOf(self.order.scripts[0].configuration.color) > -1;
    const isScaleValid = self.order.pagesPerSide.indexOf(self.order.scripts[0].configuration.pagesPerSide) > -1;
    const isSideValid = self.order.twoSided.indexOf(self.order.scripts[0].configuration.twoSided) > -1;
  }
}
