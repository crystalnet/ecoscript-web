/**
 * Created by crystalneth on 11-Jul-17.
 */

// Get the module
angular.module('order')

// Define service
  .service('PaymentService', PaymentService);

PaymentService.$inject = ['OrderService', '$q', 'UtilsService', 'AuthenticationService', '$http'];

function PaymentService(OrderService, $q, UtilsService, AuthenticationService, $http) {
  const self = this;

  self.create = function() {
    let data = {
      orderId: OrderService.id,
      userId: AuthenticationService.user.id
    };
    data = JSON.stringify(data);

    $http.post('https://us-central1-studyscript-4a797.cloudfunctions.net/createPayment', data)
      .then(function(response) {
        console.log(response);
        // this callback will be called asynchronously
        // when the response is available
      }, function(response) {
        console.log(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };

  self.patch = function() {
    let data = {
      orderId: OrderService.id,
      userId: AuthenticationService.user.id
    };
    data = JSON.stringify(data);

    $http.post('https://us-central1-studyscript-4a797.cloudfunctions.net/patchPayment', data)
      .then(function successCallback(response) {
        console.log(response);
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        console.log(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };

  self.execute = function() {
    let data = {
      orderId: OrderService.id,
      userId: AuthenticationService.user.id
    };
    data = JSON.stringify(data);

    $http.post('https://us-central1-studyscript-4a797.cloudfunctions.net/executePayment', data)
      .then(function successCallback(response) {
        console.log(response);
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        console.log(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };
}
