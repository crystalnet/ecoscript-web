/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('studyscriptApp')

// Define controllers
  .controller('navigationController', NavigationController);

NavigationController.$inject = ['$location', 'PageContext', '$anchorScroll'];

/* @ngInject */
function NavigationController($location, PageContext, $anchorScroll) {
  const self = this;

  self.pageContext = PageContext;

  self.scrollTo = function(path, hash){
    $location.path(path);
    $location.hash(hash);
    $anchorScroll();
  };
}
