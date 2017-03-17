/**
 * Created by dominik on 10/03/2017.
 */

(function () {
  'use strict';

  // Get the module
  angular.module('order')

  // Define service
    .service('UploadService', UploadService);

  UploadService.$inject = ['AuthenticationService'];

  // TODO docu
  function UploadService(AuthenticationService) {
    const self = this;

    self.uploadFile = function (file) {
      const id = generateShortId();
      const uid = AuthenticationService.getUser().uid;

      const storage = firebase.storage().ref('uploads/' + uid + '/' + id + '.pdf');
      const uploadTask = storage.put(file);

      const nextFunction = function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
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

      const completeFunction = function () {
        // Upload completed successfully, now we can get the download URL
        console.log('Upload was successful');
        //let downloadURL = uploadTask.snapshot.downloadURL;
        let asdf = firebase.database().ref('uploads/' + uid + '/' + id + '/name').set(file.name).then(console.log('asdf'));
        console.log(asdf);
        return asdf;
      };

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, nextFunction, errorFunction, completeFunction);// or 'state_changed'
    };

  }

})();
