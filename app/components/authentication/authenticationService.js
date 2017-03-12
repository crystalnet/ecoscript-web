/**
 * Created by dominik on 10/03/2017.
 */

(function () {
  'use strict';

  // Get the module
  angular.module('authentication')

  // Define service
    .service('AuthenticationService', AuthenticationService);

  // TODO docu
  function AuthenticationService() {
    var self = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('state changed');
      }
    });

    self.login = function(email, password) {
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // TODO Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, ' :', errorMessage);
      });
    };

    self.register = function(email, password) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (user) {
          user.sendEmailVerification();
        })
        .catch(function(error) {
          // TODO Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, ' :', errorMessage);
        });
    }
  }

})();