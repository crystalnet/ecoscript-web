/**
 * Created by dominik on 10/03/2017.
 */

// Get the module
angular.module('authentication')

// Define service
  .service('AuthenticationService', AuthenticationService);

AuthenticationService.$inject = ['Auth'];

// TODO docu
function AuthenticationService(Auth) {
  const self = this;

  self.uid = '';

  Auth.$onAuthStateChanged(function (user) {
    if (user) {
      self.user = user;
      self.uid = user.uid;
      self.isAnonymous = user.isAnonymous;
      console.log('Logged in as: ' + user.uid);
    }
  });


  self.googleSignIn = function () {
    // var provider = new Auth.$GoogleAuthProvider();
    const provider = new firebase.auth.GoogleAuthProvider();
    // provider.addScope('https://www.googleapis.com/auth/plus.login');

    // self.providerSignIn(provider);
    self.linkWithProvider(provider);
  };

  self.facebookSignIn = function () {
    // var provider = new Auth.$GoogleAuthProvider();
    const provider = new firebase.auth.FacebookAuthProvider();
    // provider.setCustomParameters({
    //   display: 'popup'
    // });

    self.providerSignIn(provider);
  };

  self.providerSignIn = function (provider) {
    Auth.$signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = result.credential.accessToken;
      let credential = firebase.auth.GoogleAuthProvider.credential(token);
      self.user.link(credential);
      // The signed-in user info.
      self.user = result.user;
      console.log(self.token, ' |', self.user);
    });
  };

  self.signIn = function (email, password) {
    Auth.$signInWithEmailAndPassword(email, password).catch(function (error) {
      // TODO Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, ' :', errorMessage);
    });
  };

  self.anonymousSignIn = function () {
    if (!self.user) {
      firebase.auth().signInAnonymously().catch(function (error) {
        // TODO Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    } else {
      console.log('alredy logged in');
    }
  };

  self.register = function (email, password) {
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
  };

  self.linkUser = function (email, password) {
    let credential = firebase.auth.EmailAuthProvider.credential(email, password);

    self.user.link(credential).then(function (user) {
      console.log("Account linking success", user);
    }, function (error) {
      console.log("Account linking error", error);
    });
  };

  self.linkWithProvider = function (provider) {
    self.user.linkWithPopup(provider).then(function (result) {
      // Accounts successfully linked.
      let credential = result.credential;
      self.user = result.user;
    }).catch(function (error) {
      // Handle Errors here.
    });
  };
}
