/**
 * Created by dominik on 10/03/2017.
 */

(function () {
  'use strict';

  // Get the module
  angular.module('order')

  // Define controller
    .controller('configurationController', ConfigurationController);

  ConfigurationController.$inject = ['$location', 'OrderService', '$timeout'];

  /* @ngInject */
  function ConfigurationController($location, OrderService, $timeout) {
    const self = this;
    self.order = OrderService;

    self.console = function() {
      console.log(self.order);
    }

    if (self.order.scripts.length === 0) {
      $timeout(function () {
        angular.element('#uploadButton').triggerHandler('click');
      }, 0);
    }

    self.uploadFiles = function (files, errFiles) {
      self.errFiles = errFiles;

      angular.forEach(files, function (file) {
        self.order.addScript(file).then(function (result) {
          console.log(result);

          if (self.order.scripts.length > 0) {
            self.order.stage = 2;
            const script = self.order.scripts[0].configuration;
            script.title = self.order.scripts[0].file.name;
            script.title = script.title.substring(0, script.title.lastIndexOf('.'));

            var arr = script.title.split(/\s|_/);
            for (let i = 0, l = arr.length; i < l; i++) {
              arr[i] = arr[i].substr(0, 1).toUpperCase() +
                (arr[i].length > 1 ? arr[i].substr(1).toLowerCase() : '');
            }
            script.title = arr.join(' ');
          }
        });
      });
    };

    self.next = function () {
      self.order.stage = Math.min(self.order.stage + 1, 5);
    };

    self.previous = function () {
      self.order.stage = Math.max(self.order.stage - 1, 1);
    };
  }
})();
