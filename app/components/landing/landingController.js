/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('studyscriptApp')

// Define controllers
  .controller('landingController', LandingController);

LandingController.$inject = ['$location'];

/* @ngInject */
function LandingController($location) {
  let self = this;

  // self.order = function () {
  //   $location.path('/order');
  // };
}
