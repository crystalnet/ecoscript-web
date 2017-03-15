(function () {
  'use strict';

  // Get the module
  angular.module('authentication')

  // Define service
    .factory('Auth', Auth);

  Auth.$inject = ['$firebaseAuth'];

  // TODO docu
  function Auth($firebaseAuth) {
    return $firebaseAuth();
  }

})();
