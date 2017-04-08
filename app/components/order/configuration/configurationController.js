/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('order')

  // Define controllers
    .controller('configurationController', ConfigurationController);

  ConfigurationController.$inject = ['$location', 'UploadService'];

  /* @ngInject */
  function ConfigurationController($location, UploadService) {
    const self = this;
    self.plans = [
      {value: 'greenfree', name: 'Green Free'},
      {value: 'green', name: 'Green'},
      {value: 'free', name: 'Free'},
      {value: 'black', name: 'Black'}
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
      pagesPerSide: {value: '2', name: '2 Seiten pro Blatt'},
      twoSided: {value: 'true', name: 'Vorder- und Rückseite'}
    };
  }
})();
