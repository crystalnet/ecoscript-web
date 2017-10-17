/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('scriptUploadController', ScriptUploadController);

ScriptUploadController.$inject = ['$location', 'OrderService', '$timeout', 'PageContextService', '$scope'];

function ScriptUploadController($location, OrderService, $timeout, $scope) {
  const self = this;
  self.order = OrderService;
  self.files = {};

  if (self.order.scripts.length === 0) {
    $timeout(function () {
      angular.element('#uploadButton').triggerHandler('click');
    }, 0);
  }

  self.uploadFiles = function (files, errFiles) {
    self.errFiles = errFiles;
    self.files = files;

    angular.forEach(files, function (file) {
      let promise = self.order.addScript(file);
      promise.then(function (result) {
        if (self.order.scripts.length > 0) {
          //self.order.next();
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

  // $scope.$watch(function() {
  //   return self.files;
  // }, function (newVal, oldVal) {
  //   console.log('upgrading');
  //   //componentHandler.upgradeAllRegistered();
  // });
}
