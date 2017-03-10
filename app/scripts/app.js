// Initialize Firebase
var config = {
  apiKey: "AIzaSyAa6HhfTpQyeMV1-Wh2itJFX-uOIWRzSro",
  authDomain: "studyscript-4a797.firebaseapp.com",
  databaseURL: "https://studyscript-4a797.firebaseio.com",
  storageBucket: "studyscript-4a797.appspot.com",
  messagingSenderId: "1079844072661"
};
firebase.initializeApp(config);

// Define the module
var studyscriptApp = angular.module('studyscriptApp', []);

//Define controllers
studyscriptApp.controller('sampleController', function SampleController($scope) {
  var self = this;

  self.send = function() {
    console.log(self.user, " :", self.password);

    firebase.auth().createUserWithEmailAndPassword(self.user, self.password).catch(function(error) {
       //TODO Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       console.log(errorCode, " :", errorMessage);
    });
  }
});
