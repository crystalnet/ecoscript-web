/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('studyscriptApp')

// Define controllers
  .controller('navigationController', NavigationController);

NavigationController.$inject = ['$location', 'PageContextService', '$anchorScroll'];

function NavigationController($location, PageContextService, $anchorScroll) {
  const self = this;

  self.pageContext = PageContextService;

  self.scrollTo = function(path, hash){
    $location.path(path);
    $location.hash(hash);
    $anchorScroll();
    console.log('asdf');
  };
}
