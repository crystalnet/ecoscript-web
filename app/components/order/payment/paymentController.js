/**
 * Created by crystalneth on 14-Jun-17.
 */

// Get the module
angular.module('order')

// Define controller
  .controller('paymentController', PaymentController);

PaymentController.$inject = ['$location', 'OrderService', '$timeout', 'PageContextService', 'AuthenticationService', '$http', 'PaymentService'];

function PaymentController($location, OrderService, $timeout, PageContextService, AuthenticationService, $http, PaymentService) {
  const self = this;
  const Authentication = AuthenticationService;
  self.order = OrderService;
  self.Payment = PaymentService;

  if (typeof PAYPAL !== 'undefined') {
    let ppp = PAYPAL.apps.PPP({
      'approvalUrl': self.Payment.approvalUrl,
      'placeholder': 'ppplus',
      'mode': 'sandbox',
      'country': 'DE'
    });
  }

  // let path = 'https://www.paypalobjects.com/webstatic/ppplus/ppplus.min.js';
  // $http.get(path)
  //   .then(function (response) {
  //     console.log('got it');
  //     let ppp = PAYPAL.apps.PPP({
  //       'approvalUrl': '\'.$approval_url.\'',
  //       'placeholder': 'ppplus',
  //       'mode': 'sandbox',
  //       'country': 'DE'
  //     });
  //   })
  //   .catch(function () {
  //     console.log('unable to get ppplus');
  //   });
}
