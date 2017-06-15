/**
 * Created by crystalneth on 11-Mar-17.
 */

// Define the module
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
    $rootScope.$on('$includeContentLoaded', function() {
      $timeout(function() {
        componentHandler.upgradeAllRegistered();
      });
    });
  });
