/**
 * Created by crystalneth on 11-Mar-17.
 */

// Get the module
angular.module('scriptecoApp')

// Define routes
  .config(config);

config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];

// TODO documentation
function config($routeProvider, $locationProvider, $httpProvider) {
  $locationProvider.html5Mode({
    enabled: true
  });

  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;

  //Remove the header containing XMLHttpRequest used to identify ajax call
  //that would prevent CORS from working
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $routeProvider
    .when('/', {
      templateUrl: 'components/landing/landingView.htm'
    })

    .when('/login', {
      templateUrl: 'components/authentication/authenticationView.htm'
    })

    .when('/order', {
      templateUrl: 'components/order/orderView.htm'
    })

    .when('/thankyou', {
      templateUrl: 'components/payment/thankyou.htm'
    })

    .when('/agb', {
      templateUrl: 'components/law/agb.htm'
    })

    .when('/impressum', {
      templateUrl: 'components/law/impressum.htm'
    })

    .otherwise({
      redirectTo: '/'
    });
}
