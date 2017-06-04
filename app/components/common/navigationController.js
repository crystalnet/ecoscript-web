/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('studyscriptApp')

// Define controllers
  .controller('navigationController', NavigationController);

NavigationController.$inject = ['$location', 'PageContext'];

/* @ngInject */
function NavigationController($location, PageContext) {
  const self = this;

  self.pageContext = PageContext

  self.authenticate = function () {
    $location.path('/login');
  };

  self.home = function () {
    $location.path('/');
  };
}
