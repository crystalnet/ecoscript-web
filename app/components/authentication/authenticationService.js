/**
 * Created by dominik on 10/03/2017.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('authentication')

  // Define service
    .service('AuthenticationService', AuthenticationService);

  AuthenticationService.$inject = ['Auth'];

  // TODO docu
  function AuthenticationService(Auth) {
    var self = this;

    Auth.$onAuthStateChanged(function(user) {
      if (user) {
        self.user = user;
        console.log('Logged in as: ' + user.uid);
      }
    });

    self.googleSignIn = function() {
      // var provider = new Auth.$GoogleAuthProvider();
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');

      self.providerSignIn(provider);
    };

    self.facebookSignIn = function() {
      // var provider = new Auth.$GoogleAuthProvider();
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.setCustomParameters({
        display: 'popup'
      });

      self.providerSignIn(provider);
    };

    self.providerSignIn = function(provider) {
      Auth.$signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        self.token = result.credential.accessToken;
        // The signed-in user info.
        self.user = result.user;
        console.log(self.token, ' |', self.user);
      });
    };

    self.signIn = function(email, password) {
      Auth.$signInWithEmailAndPassword(email, password).catch(function(error) {
        // TODO Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, ' :', errorMessage);
      });
    };

    self.register = function(email, password) {
      Auth.$createUserWithEmailAndPassword(email, password)
        .then(function(user) {
          user.sendEmailVerification();
        })
        .catch(function(error) {
          // TODO Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, ' :', errorMessage);
        });
    };

    self.getUser = function() {
      return self.user;
    };
  }
})();
