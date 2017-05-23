/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('order')

  // Define controllers
    .controller('configurationController', ConfigurationController);

  ConfigurationController.$inject = ['$location', 'OrderService', '$timeout'];

  /* @ngInject */
  function ConfigurationController($location, OrderService, $timeout) {
    const self = this;
    self.stage = function() {
      return OrderService.getStage();
    };

    if (!OrderService.getSelected() === true) {
      $timeout(function() {
        angular.element('#uploadButton').triggerHandler('click');
      }, 0);
    }

    self.uploadFiles = function(files, errFiles) {
      self.files = files;
      self.errFiles = errFiles;

      if (self.files !== null) {
        OrderService.scriptSelected = true;
      }

      angular.forEach(self.files, function(file) {
        OrderService.uploadFile(file);
      });
      $location.path('/order');
    };

    self.next = function() {
      OrderService.setStage(self.stage() + 1);
    };

    self.previous = function() {
      OrderService.setStage(self.stage() - 1);
    };

    self.plans = [
      {value: 'greenfree', name: 'Green Free'},
      {value: 'green', name: 'Green'},
      {value: 'free', name: 'Free'},
      {value: 'black', name: 'Black'}
    ];

    self.color = [
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
