/**
 * Created by crystalneth on 28-May-17.
 */

(function () {
  'use strict';

  // Get the module
  angular.module('order')

  // Define service
    .service('UploadService', UploadService);

  UploadService.$inject = ['AuthenticationService', '$q'];

  function UploadService(AuthenticationService, $q) {
    const self = this;

    self.uploadFile = function(file) {
      const deferred = $q.defer();

      const nextFunction = function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        deferred.notify('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            deferred.notify('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            deferred.notify('Upload is running');
            break;
          default:
            deferred.notify(snapshot);
        }
      };

      const errorFunction = function (error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            deferred.reject(error.code + ' :' + error.message);
            break;
          case 'storage/canceled':
            // User canceled the upload
            deferred.reject(error.code + ' :' + error.message);
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            deferred.reject(error.code + ' :' + error.message);
            break;
          default:
            deferred.reject(error.code + ' :' + error.message);
        }
      };

      const completeFunction = function () {
        // Upload completed successfully, now we can get the download URL
        deferred.resolve('Upload was successful');
        // let downloadURL = uploadTask.snapshot.downloadURL;
        // return $timeout(firebase.database().ref('uploads/' + uid + '/' + id + '/name')
        //  .set(file.name)
        //  .then(console.log('qwer')), 2000);
      };

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

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        nextFunction,
        errorFunction,
        completeFunction);

      return deferred.promise;
    };

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
})();
