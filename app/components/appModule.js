/**
 * Created by crystalneth on 11-Mar-17.
 */

  // Define the module
  /* @ngInject */
  angular.module('studyscriptApp', [
    'ngRoute',
    'authentication',
    'order',
    'ngFileUpload',
    'firebase'
  ])
    // Prevent MDL issues
    .run(function($rootScope, $timeout) {
      $rootScope.$on('$viewContentLoaded', function() {
        $timeout(function() {
          componentHandler.upgradeAllRegistered();
        });
      });
    });
