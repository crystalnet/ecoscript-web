/**
 * Created by crystalneth on 22-Mar-17.
 */

(function () {
  'use strict';

  // Get the module
  angular.module('order')

  // Define service
    .service('OrderService', OrderService);

  OrderService.$inject = ['UploadService', '$q'];

  function OrderService(UploadService, $q) {
    const self = this;

    self.stage = 1;
    self.scripts = [];

    self.addScript = function (file) {
      const deferred = $q.defer();

      UploadService.uploadFile(file)
        .then(function (result) {
          self.scripts = [{file: file, configuration: self.configuration}];
          // For future extension
          // self.scripts.push(file);
          deferred.resolve(result);
        }, function (error) {
          deferred.reject(error);
        }, function (notification) {
          deferred.notify(notification);
        });

      return deferred.promise;
    };

    self.plans = [
      {value: 'greenfree', name: 'Green Free'},
      {value: 'green', name: 'Green'},
      {value: 'free', name: 'Free'},
      {value: 'black', name: 'Black'}
    ];

    self.colors = [
      {value: 'sw', name: 'Black and white'},
      {value: 'color', name: 'Colored'}
    ];

    self.pagesPerSide = [
      {value: '1', name: '1 Seite pro Blatt'},
      {value: '2', name: '2 Seiten pro Blatt'},
      {value: '4', name: '4 Seiten pro Blatt'},
      {value: '8', name: '8 Seiten pro Blatt'}
    ];

    self.twoSided = [
      {value: 'true', name: 'Vorder- und Rückseite'},
      {value: 'false', name: 'nur Vorderseite'}
    ];

    self.configuration = {
      plan: {value: 'green', name: 'Green'},
      color: {value: 'sw', name: 'Black and white'},
      pagesPerSide: {value: '2', name: '2 Seiten pro Blatt'},
      twoSided: {value: 'true', name: 'Vorder- und Rückseite'}
    };
  }
})();
