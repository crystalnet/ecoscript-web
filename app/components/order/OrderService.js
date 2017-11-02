/**
 * Created by crystalneth on 22-Mar-17.
 */

// Get the module
angular.module('order')

// Define service
  .service('OrderService', OrderService);

OrderService.$inject = ['UploadService', '$q', 'UtilsService', 'AuthenticationService', '$http', 'Auth', '$rootScope'];

function OrderService(UploadService, $q, UtilsService, AuthenticationService, $http, Auth, $rootScope) {
  const self = this;
  self.stage = 1;
  self.scripts = [];
  self.particulars = {};

  self.initialize = function () {
    return Auth.$waitForSignIn().then(function () {
      return AuthenticationService.anonymousSignIn().then(function () {
        if (!self.id) {
          if (!AuthenticationService.user.isAnonymous) {
            self.orderSteps.splice(4, 1);
          }
          let deferred = $q.defer();
          self.uid = AuthenticationService.user.uid;
          firebase.database().ref('users/' + self.uid + '/current_order/').once('value').then(function (currentOrder) {
            if (currentOrder.val() && currentOrder.val() !== 'undefined') {
              self.readOrder(currentOrder.val()).then(function() {
                $rootScope.$apply();
                deferred.resolve();
              });
            } else {
              const location = firebase.database().ref('users/' + self.uid + '/orders/').push(true, function () {
                self.id = location.key;
                firebase.database().ref('orders/' + self.id + '/total').on('value', function (snapshot) {
                  self.total = snapshot.val();
                });
                self.saveOrder();
                firebase.database().ref('users/' + self.uid + '/current_order').set(self.id);
                deferred.resolve();
              });
            }
          });
          return deferred.promise;
        }
      });
    });
  };

  self.initialize();

  self.addScript = function (file) {
    //   return self.initialize().then(function () {
    let location = firebase.database().ref('users/' + self.uid + '/order_items/').push(true);

    let script = {
      id: location.key,
      file: file,
      configuration: angular.copy(self.configuration)
    };

    return UploadService.uploadScript(script)
      .then(function (result) {
        // self.scripts.push(script);
        self.scripts[0] = script;
        self.scripts[0].configuration.script = result;

        firebase.database().ref('order_items/' + script.id + '/price').on('value', function (snapshot) {
          //$scope.$apply(function () {
          self.scripts[0].price = snapshot.val();
          //});
        });

        Object.defineProperty(self.scripts[0], 'color', {
          get: function () {
            return this.configuration.color;
          },
          set: function (x) {
            x = angular.toJson(x);
            x = angular.fromJson(x);
            this.configuration.color = x;
            //firebase.database().ref('order_items/' + this.id).update({color: x, order: self.id});
          }
        });

        Object.defineProperty(self.scripts[0], 'twoSided', {
          get: function () {
            return this.configuration.twoSided;
          },
          set: function (x) {
            x = angular.toJson(x);
            x = angular.fromJson(x);
            this.configuration.twoSided = x;
            //firebase.database().ref('order_items/' + this.id).update({twoSided: x, order: self.id});
          }
        });

        Object.defineProperty(self.scripts[0], 'pagesPerSide', {
          get: function () {
            return this.configuration.pagesPerSide;
          },
          set: function (x) {
            x = angular.toJson(x);
            x = angular.fromJson(x);
            this.configuration.pagesPerSide = x;
            //firebase.database().ref('order_items/' + this.id).update({pagesPerSide: x, order: self.id});
          }
        });

        let title = script.file.name;
        title = title.substring(0, title.lastIndexOf('.'));
        title = title.split(/\s|_/);
        for (let i = 0, l = title.length; i < l; i++) {
          title[i] = title[i].substr(0, 1).toUpperCase() +
            (title[i].length > 1 ? title[i].substr(1).toLowerCase() : '');
        }
        script.configuration.title = title.join(' ');

        return result;
      }, function (error) {
        return error;
      }, function (notification) {
        console.log('got notification');
        return notification;
      });
    //return deferred.promise;
    //   });
  };

  self.getPrices = function() {
    return $http.post('https://us-central1-scripteco-prod.cloudfunctions.net/getOrderItemPrices', {orderItemId: self.scripts[0].id})
      .then(function successCallback(response) {
        console.log(response);
        self.scripts[0].prices = response.data;
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        console.log(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };

  self.saveOrder = function () {
    let orderData = {
      stage: self.stage,
      particulars: self.particulars,
      order_items: {},
      user: self.uid
    };

    for (var i = 0; i < self.scripts.length; i++) {
      const script = self.scripts[i];
      orderData.order_items[script.id] = true;

      let scriptData = script.configuration;
      scriptData.order = self.id;

      // Remove Angular Properties
      scriptData = angular.toJson(scriptData);
      scriptData = angular.fromJson(scriptData);

      firebase.database().ref('order_items/' + script.id).update(scriptData);
    }

    // Remove Angular Properties
    orderData = angular.toJson(orderData);
    orderData = angular.fromJson(orderData);

    firebase.database().ref('orders/' + self.id).update(orderData);
  };

  self.readOrder = function (orderId) {
    self.id = orderId;
    return firebase.database().ref('orders/' + orderId).once('value').then(function (snapshot) {
      self.particulars = snapshot.child('particulars').val();
      self.stage = snapshot.child('stage').val();
      self.scripts = [];

      firebase.database().ref('orders/' + orderId + '/total').on('value', function (snapshot) {
        self.total = snapshot.val();
      });

      let promises = [];
      snapshot.child('order_items').forEach(function (orderItemId) {
        promises.push(firebase.database().ref('order_items/' + orderItemId.key).once('value').then(function (orderItem) {
          let script = {
            id: orderItemId.key,
            configuration: orderItem.val()
          };
          delete script.configuration.price;
          delete script.configuration.order;
          self.scripts.push(script);

          firebase.database().ref('order_items/' + orderItemId.key + '/price').on('value', function (snapshot) {
            //$scope.$apply(function () {
            self.scripts[0].price = snapshot.val();
            //});
          });
        }));
      });
      return Promise.all(promises);
    });
  };

  self.next = function () {
    self.validateInputs();
    //self.initialize().then(function () {
    self.stage = Math.min(self.stage + 1, self.orderSteps.length);
    self.saveOrder();
    //});
  };

  self.previous = function () {
    self.validateInputs();
    //self.saveOrder();
    self.stage = Math.max(self.stage - 1, 1);
  };

  self.console = function () {
    console.log(self);
  };

  self.validateInputs = function () {
    // const isScriptUploaded = self.order.scripts.length > 0;
    // const isTitleSelected = Boolean(self.order.scripts[0].configuration.title);
    // const isPlanValid = self.order.plans.indexOf(self.order.scripts[0].configuration.plan) > -1;
    // const isColorValid = self.order.colors.indexOf(self.order.scripts[0].configuration.color) > -1;
    // const isScaleValid = self.order.pagesPerSide.indexOf(self.order.scripts[0].configuration.pagesPerSide) > -1;
    // const isSideValid = self.order.twoSided.indexOf(self.order.scripts[0].configuration.twoSided) > -1;
  };

// URLs of order steps
  const scriptUpload = 'components/order/script/scriptUpload.htm';
  const scriptTitle = 'components/order/script/scriptTitle.htm';
  const scriptPlan = 'components/order/script/scriptPlan.htm';
  const scriptColorSelection = 'components/order/script/scriptColorSelection.htm';
  const scriptPrintConfiguration = 'components/order/script/scriptPrintConfiguration.htm';
  const particularsSignIn = 'components/order/particulars/particularsSignIn.htm';
  const particularsData = 'components/order/particulars/particularsData.htm';
  const payment = 'components/order/payment/paymentView.htm';

  self.orderSteps = [
    scriptUpload,
    scriptTitle,
    // scriptPlan,
    scriptColorSelection,
    scriptPrintConfiguration,
    particularsSignIn,
    particularsData,
    payment
  ];

  self.plans = [
    {value: 'greenfree', name: 'Green Free'},
    {value: 'green', name: 'Green'},
    {value: 'free', name: 'Free'},
    {value: 'black', name: 'Black'}
  ];

  self.colors = [
    {value: 'sw', name: 'Black and white'},
    {value: 'color', name: 'Colored'}
  ];

  self.pagesPerSide = [
    {value: '1', name: '1 Seite pro Blatt'},
    {value: '2', name: '2 Seiten pro Blatt'},
    {value: '4', name: '4 Seiten pro Blatt'},
    {value: '8', name: '8 Seiten pro Blatt'}
  ];

  self.twoSided = [
    {value: 'true', name: 'Vorder- und Rückseite'},
    {value: 'false', name: 'nur Vorderseite'}
  ];

  self.configuration = {
    plan: self.plans[0],
    color: self.colors[0],
    pagesPerSide: self.pagesPerSide[1],
    twoSided: self.twoSided[0]
  };
}
