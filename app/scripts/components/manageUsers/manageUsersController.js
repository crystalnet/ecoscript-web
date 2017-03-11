/**
 * Created by dominik on 10/03/2017.
 */

(function () {
  'use strict';

  // Get the module
  angular.module('studyscriptApp')

  // Define controllers
    .controller('sampleController', SampleController);

  SampleController.$inject = ['$scope'];

  /* @ngInject */
  function SampleController($scope) {
    var self = this;

    self.send = function () {
      console.log(self.user, " :", self.password);

      firebase.auth().createUserWithEmailAndPassword(self.user, self.password).catch(function (error) {
        //TODO Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, " :", errorMessage);
      });
    }
  }
})();

