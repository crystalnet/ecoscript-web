/**
 * Created by crystalneth on 22-Mar-17.
 */

(function() {
  'use strict';

  // Get the module
  angular.module('order')

  // Define service
    .service('OrderService', OrderService);

  OrderService.$inject = ['AuthenticationService'];

  function OrderService(AuthenticationService) {
    const self = this;

    self.scriptSelected = false;
    self.stage = 1;

    self.getStage = function() {
      return self.stage;
    };

    self.setStage = function(stage) {
      self.stage = stage;
    };

    self.getSelected = function() {
      return self.scriptSelected;
    };

    self.setScriptSelected = function(selected) {
      self.scriptSelected = selected;
    };

    self.order = {
      scripts: [],
      address: {},
      total: 42.00
    };

    self.uploadFile = function(file) {
      const id = self.generateShortId();
      const uid = AuthenticationService.getUser().uid;
      const storage = firebase.storage().ref('uploads/' + uid + '/' + id +
        '.pdf');
      const metadata = {
        customMetadata: {
          name: file.name.slice(0, file.name.lastIndexOf('.'))
        }
      };
      const uploadTask = storage.put(file, metadata);

      const nextFunction = function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
          default:
            console.log(snapshot);
        }
      };

      const errorFunction = function(error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log(error.code + ' :' + error.message);
            break;
          case 'storage/canceled':
            // User canceled the upload
            console.log(error.code + ' :' + error.message);
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            console.log(error.code + ' :' + error.message);
            break;
          default:
            console.log(error.code + ' :' + error.message);
        }
      };

      const completeFunction = function() {
        // Upload completed successfully, now we can get the download URL
        console.log('Upload was successful');
        self.stage = 2;
        // let downloadURL = uploadTask.snapshot.downloadURL;
        // return $timeout(firebase.database().ref('uploads/' + uid + '/' + id + '/name')
        //  .set(file.name)
        //  .then(console.log('qwer')), 2000);
      };

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        nextFunction,
        errorFunction,
        completeFunction);
    };

    self.generateShortId = function() {
      const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const idLength = 8;
      let result = '';

      for (let i = 0; i < idLength; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      return result;
    };
  }
})();
