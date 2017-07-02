/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('studyscriptApp')

// Define controllers
  .controller('landingController', LandingController);

LandingController.$inject = ['$scope'];

/* @ngInject */
function LandingController($scope) {
  let self = this;

  self.disable = false;
  self.error = false;

  self.saveData = function () {
    self.disable = false;
    if (self.email) {
      firebase.database().ref('prospects').push(self.email)
        .then(function () {
          self.disable = true;
          self.error = false;
          self.email = '';
          $scope.$apply();
        })
        .catch(function (err) {
          self.disable = false;
          self.error = true;
          console.log(err.message);
        });
    } else {
      self.error = true;
    }
  };
}
