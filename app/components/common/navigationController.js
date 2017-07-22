/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('scriptecoApp')

// Define controllers
  .controller('navigationController', NavigationController);

NavigationController.$inject = ['$location', 'PageContextService', '$anchorScroll', 'AuthenticationService'];

function NavigationController($location, PageContextService, $anchorScroll, AuthenticationService) {
  const self = this;

  self.pageContext = PageContextService;

  self.signedIn = function() {
    return Boolean(AuthenticationService.user);
  };

  self.signOut = function() {
    AuthenticationService.signOut();
  };

  self.scrollTo = function(path, hash){
    $location.path(path);
    $location.hash(hash);
    $anchorScroll();
  };
}
