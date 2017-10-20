/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('authentication')

// Define service
  .service('AuthenticationService', AuthenticationService);

AuthenticationService.$inject = ['Auth', '$location', '$q'];

// TODO docu
function AuthenticationService(Auth, $location, $q) {
  const self = this;

  // self.uid = '';

  Auth.$onAuthStateChanged(function (user) {
    if (user) {
      self.user = user;
      console.log('Logged in as: ' + user.uid);
    } else {
      self.user = null;
      console.log('Logged out');
    }
  });

  self.anonymousSignIn = function () {
    const deferred = $q.defer();
    self.user = Auth.$getAuth();

    if (!self.user) {
      firebase.auth().signInAnonymously()
        .then(function (user) {
          self.user = user;
          console.log('successful anonymous login');
          deferred.resolve('successful anonymous login');
        })
        .catch(function (error) {
          // TODO Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorCode, errorMessage);
          deferred.reject('error with anonymous login');
        });
    } else {
      console.log('already logged in');
      deferred.resolve('already logged in');
    }
    return deferred.promise;
  };

  self.register = function (email, password) {
    self.user = Auth.$getAuth();

    if (!self.user) {
      Auth.$createUserWithEmailAndPassword(email, password)
        .then(function (user) {
          self.user = user;
          user.sendEmailVerification();
        })
        .catch(function (error) {
          // TODO Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, ' :', errorMessage);
        });
    } else if (self.user.isAnonymous) {
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
    const deferred = $q.defer();
    self.user = Auth.$getAuth();

    if (!self.user) {
      Auth.$signInWithEmailAndPassword(email, password)
        .then(function (user) {
          self.user = user;
          deferred.resolve('signed in');
        })
        .catch(function (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, ' :', errorMessage);
          deferred.reject('unable to login');
        });
    } else if (self.user.isAnonymous) {
      self.signOut(false).then(function () {
        self.signIn(email, password)
          .then(function () {
            deferred.resolve('merged account');
          })
          .catch(function () {
            deferred.resolve('unable to merge accounts');
          });
      });
    } else {
      console.log('You are already logged in');
      deferred.resolve('already logged in');
    }
    return deferred.promise;
  };

  self.googleSignIn = function () {
    self.providerSignIn(new firebase.auth.GoogleAuthProvider());
  };

  self.facebookSignIn = function () {
    self.providerSignIn(new firebase.auth.FacebookAuthProvider());
  };

  self.providerSignIn = function (provider) {
    const deferred = $q.defer();
    self.user = Auth.$getAuth();

    if (!self.user) {
      Auth.$signInWithPopup(provider)
        .then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          let token = result.credential.accessToken;
          let credential = firebase.auth.GoogleAuthProvider.credential(token);
          deferred.resolve('signed in');
        })
        .catch(function (error) {
          deferred.resolve('unable to sign in');
        });
    } else if (self.user.isAnonymous) {
      self.signOut(false).then(function () {
        self.providerSignIn(provider);
      });
    } else {
      console.log('You are already logged in');
      deferred.resolve('already logged in');
    }
    return deferred.promise;
  };

  self.providerRegister = function (provider) {
    self.user = Auth.$getAuth();

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

  self.signOut = function (redirect) {
    if (redirect == undefined) {
      redirect = true;
    }
    const deferred = $q.defer();

    firebase.auth().signOut().then(function () {
      self.user = null;
      if (redirect) {
        $location.path('/');
      }
      // Logged out
      deferred.resolve('logged out');
    }).catch(function (error) {
      // An error happened.
      deferred.reject('problem with log out');
    });
    return deferred.promise;
  };
}
