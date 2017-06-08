/**
 * Created by crystalneth on 30-May-17.
 */

// Get the module
angular.module('studyscriptApp')

// Define service
  .service('UtilsService', UtilsService);

// Utils.$inject = ['AuthenticationService', '$q'];

function UtilsService() {
  const self = this;

  self.generateShortId = function () {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const idLength = 8;
    let result = '';

    for (let i = 0; i < idLength; i++) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return result;
  };

  return self;
}
