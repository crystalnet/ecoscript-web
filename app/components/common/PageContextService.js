/**
 * Created by crystalneth on 04-Jun-17.
 */

// Get the module
angular.module('scriptecoApp')

// Define service
  .service('PageContextService', PageContext);

PageContext.$inject = ['$rootScope'];

function PageContext($rootScope) {
  const self = this;

  self.defaultContext = {
    title: 'Default Title',
    headerUrl: 'components/common/defaultHeader.htm',
    footerUrl: 'components/common/defaultFooter.htm'
  };

  self.currentContext = angular.copy(self.defaultContext);

  $rootScope.$on('$locationChangeStart', function () {
    angular.extend(self.currentContext, self.defaultContext);
  });

  return self.currentContext;
}
