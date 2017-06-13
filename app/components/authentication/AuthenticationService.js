/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('authentication')

// Define service
  .service('AuthenticationService', AuthenticationService);

AuthenticationService.$inject = ['Auth', '$location'];

// TODO docu
function AuthenticationService(Auth, $location) {
  const self = this;

  // self.uid = '';

  Auth.$onAuthStateChanged(function (user) {
    if (user) {
      self.user = user;
      self.uid = user.uid;
      self.isAnonymous = user.isAnonymous;
      console.log('Logged in as: ' + user.uid);
    } else {
      self.user = null;
      self.uid = null;
      self.isAnonymous = null;
      $location.path('/');
      console.log('Logged out');
    }
  });

  self.anonymousSignIn = function () {
    if (!self.user) {
      firebase.auth().signInAnonymously().catch(function (error) {
        // TODO Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    } else {
      console.log('already logged in');
    }
  };

  self.register = function (email, password) {
    if (!self.user) {
      Auth.$createUserWithEmailAndPassword(email, password)
        .then(function (user) {
          user.sendEmailVerification();
        })
        .catch(function (error) {
          // TODO Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, ' :', errorMessage);
        });
    } else if (self.isAnonymous) {
      console.log(email, ', ', password);
      let credential = firebase.auth.EmailAuthProvider.credential(email, password);
      self.user.linkWithCredential(credential).then(function (user) {
        console.log('Account linking success', user);
      }, function (error) {
        console.log('Account linking error', error);
      });
    } else {
      console.log('You are already logged in');
    }
  };

  self.signIn = function (email, password) {
    console.log('im here');
    if (!self.user) {
      Auth.$signInWithEmailAndPassword(email, password).catch(function (error) {
        // TODO Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, ' :', errorMessage);
      });
    } else if (self.user.isAnonymous) {
      console.log('User is anonymous');
      self.signOut().signIn(email, password);
    } else {
      console.log('You are already logged in');
    }
  };

  self.googleSignIn = function () {
    self.providerSignIn(new firebase.auth.GoogleAuthProvider());
  };

  self.facebookSignIn = function () {
    self.providerSignIn(new firebase.auth.FacebookAuthProvider());
  };

  self.providerSignIn = function (provider) {
    if (!self.user) {
      Auth.$signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
        let credential = firebase.auth.GoogleAuthProvider.credential(token);
      });
    } else if (self.user.isAnonymous) {
      self.signOut().providerSignIn(provider);
    } else {
      console.log('You are already logged in');
    }
  };

  self.providerRegister = function (provider) {
    if (!self.user) {
      self.providerSignIn(provider);
    } else if (self.user.isAnonymous) {
      self.user.linkWithPopup(provider).then(function (result) {
        // Accounts successfully linked.
        let credential = result.credential;
      }).catch(function (error) {
        // Handle Errors here.
      });
    } else {
      console.log('You are already logged in');
    }
  };

  self.signOut = function () {
    firebase.auth().signOut().then(function () {
      // Logged out
    }).catch(function (error) {
      // An error happened.
    });
  };
}
