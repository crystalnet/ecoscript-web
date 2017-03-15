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
    var self = this;

    self.uploadFile = function(file){
      var storage = firebase.storage().ref('uploads/' + AuthenticationService.getUser().uid + '/' + file.name);
      console.log(storage);
      var uploadTask = storage.put(file);
      console.log(uploadTask);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        }, function(error) {

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
        }, function() {
          // Upload completed successfully, now we can get the download URL
          console.log('Upload was successful');
          var downloadURL = uploadTask.snapshot.downloadURL;
        });
    }

  }

})();
