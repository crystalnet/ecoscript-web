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

  self.addScript = function(file) {
    const deferred = $q.defer();

    UploadService.uploadFile(file)
      .then(function(result) {
        self.scripts = [{file: file, configuration: self.configuration}];
        // For future extension
        // self.scripts.push(file);

        self.updateStage();
        const script = self.scripts[0].configuration;
        script.title = self.scripts[0].file.name;
        script.title = script.title.substring(0, script.title.lastIndexOf('.'));

        let arr = script.title.split(/\s|_/);
        for (let i = 0, l = arr.length; i < l; i++) {
          arr[i] = arr[i].substr(0, 1).toUpperCase() +
            (arr[i].length > 1 ? arr[i].substr(1).toLowerCase() : '');
        }
        script.title = arr.join(' ');

        deferred.resolve(result);
      }, function(error) {
        deferred.reject(error);
      }, function(notification) {
        deferred.notify(notification);
      });

    return deferred.promise;
  };

  self.update = function() {
    let location = 'orders/' + AuthenticationService.getUser().uid + '/' + self.id;
    firebase.database().ref(location).set({
      scripts: self.scripts,
      adress: 'Dies ist eine Adresse'
    });
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
