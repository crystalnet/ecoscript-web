/**
 * Created by crystalneth on 22-Mar-17.
 */

// Get the module
angular.module('order')

// Define service
  .service('OrderService', OrderService);

OrderService.$inject = ['UploadService', '$q', 'UtilsService', 'AuthenticationService'];

function OrderService(UploadService, $q, UtilsService, AuthenticationService) {
  const self = this;

  self.initialize = function () {
    const deferred = $q.defer();

    AuthenticationService.anonymousSignIn().then(function () {
      if (!self.id) {
        self.uid = AuthenticationService.user.uid;
        const location = firebase.database().ref('users/' + self.uid + '/orders/').push(true);
        self.id = location.key;
        //firebase.database().ref('orders/' + self.id + '/user').set(self.uid);
      }
      deferred.resolve('initialized');
    })
      .catch(function () {
        deferred.reject('could not check sign in')
      });

    return deferred.promise;
  };

  self.stage = 1;
  self.scripts = [];
  self.particulars = {};

  self.addScript = function (file) {
    const deferred = $q.defer();
    let location = null;

    self.initialize().then(function () {
      location = firebase.database().ref('users/' + self.uid + '/order_items/').push(true);

      let script = {
        id: location.key,
        file: file,
        configuration: angular.copy(self.configuration)
      };

      UploadService.uploadScript(script)
        .then(function (result) {
          // self.scripts.push(script);
          self.scripts[0] = script;
          self.scripts[0].configuration.script = result;

          let title = script.file.name;
          title = title.substring(0, title.lastIndexOf('.'));
          title = title.split(/\s|_/);
          for (let i = 0, l = title.length; i < l; i++) {
            title[i] = title[i].substr(0, 1).toUpperCase() +
              (title[i].length > 1 ? title[i].substr(1).toLowerCase() : '');
          }
          script.configuration.title = title.join(' ');

          deferred.resolve(result);
        }, function (error) {
          deferred.reject(error);
        }, function (notification) {
          console.log('got notification');
          deferred.notify(notification);
        });
    }, function (error) {
      deferred.reject('could not initialize');
    }, function (notification) {
      conosle.log(notification);
    });

    return deferred.promise;
  };


  self.update = function () {
    let orderData = {
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

      firebase.database().ref('order_items/' + script.id).set(scriptData);
    }

    // Remove Angular Properties
    orderData = angular.toJson(orderData);
    orderData = angular.fromJson(orderData);

    firebase.database().ref('orders/' + self.id).set(orderData);
  };

  self.next = function () {
    self.validateInputs();
    self.initialize().then(function () {
      self.update();
    });
    self.stage = Math.min(self.stage + 1, self.maxStage);
  };

  self.previous = function () {
    self.validateInputs();
    //self.update();
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

  self.maxStage = 8;

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
    plan: {value: 'green', name: 'Green'},
    color: {value: 'sw', name: 'Black and white'},
    pagesPerSide: {value: '2', name: '2 Seiten pro Blatt'},
    twoSided: {value: 'true', name: 'Vorder- und Rückseite'}
  };
}
