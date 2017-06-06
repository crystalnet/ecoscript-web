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

  self.scripts = [];
  self.id = UtilsService.generateShortId();
  AuthenticationService.anonymousSignIn();

  self.addScript = function (file) {
    const deferred = $q.defer();

    let script = {
      id: UtilsService.generateShortId(),
      file: file,
      configuration: angular.copy(self.configuration)
    };

    UploadService.uploadScript(script)
      .then(function (result) {
        self.scripts.push(script);

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
        deferred.notify(notification);
      });

    return deferred.promise;
  };

  self.update = function () {
    const uid = AuthenticationService.uid;
    let location = 'orders/' + uid + '/' + self.id;

    let data = {
      address: 'Dies ist eine Adresse',
      scripts: {}
    };

    for (var i = 0; i < self.scripts.length; i++) {
      let script = self.scripts[i];
      data.scripts[script.id] = script.configuration;
    }

    // Remove Angular Properties
    data = angular.toJson(data);
    data = angular.fromJson(data);

    firebase.database().ref(location).set(data);
  };

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
