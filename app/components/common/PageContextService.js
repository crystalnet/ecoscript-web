/**
 * Created by crystalneth on 04-Jun-17.
 */

// Get the module
angular.module('studyscriptApp')

// Define service
  .service('PageContext', PageContext);

function PageContext() {
  const self = this

  self.defaultCtx = {
    title: 'Default Title',
    headerUrl: 'default-header.tmpl.html',
    footerUrl: 'default-footer.tmpl.html'
  };

  self.currentCtx = angular.copy(self.defaultCtx);

  return {
    $get: function ($rootScope) {

      // We probably want to revert back to the default whenever
      // the location is changed.

      $rootScope.$on('$locationChangeStart', function () {
        angular.extend(self.currentCtx, self.defaultCtx);
      });

      return self.currentCtx;
    }
  };
}
