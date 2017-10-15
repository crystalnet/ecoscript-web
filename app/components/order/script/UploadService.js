/**
 * Created by crystalneth on 28-May-17.
 */

// Get the module
angular.module('order')

// Define service
  .service('UploadService', UploadService);

UploadService.$inject = ['AuthenticationService', '$q', 'UtilsService'];

function UploadService(AuthenticationService, $q, UtilsService) {
  const self = this;

  self.uploadScript = function (script) {
    const deferred = $q.defer();

    const nextFunction = function (snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          deferred.notify('Paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          // TODO replace with const if angular-filesort allows
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('at beginning progress is ' + progress);
          deferred.notify(progress);
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

    const completeFunction = function (key) {
      // Upload completed successfully, now we can get the download URL
      deferred.resolve(key);
      // let downloadURL = uploadTask.snapshot.downloadURL;
      // return $timeout(firebase.database().ref('uploads/' + uid + '/' + id + '/name')
      //  .set(file.name)
      //  .then(console.log('qwer')), 2000);
    };

    const uid = AuthenticationService.user.uid;
    const location = firebase.database().ref('users/' + uid + '/scripts').push(true);
    const key = location.key;
    // key.set({key: true});

    const storage = firebase.storage().ref('uploads/' + uid + '/' + key +
      '.pdf');
    const metadata = {
      customMetadata: {
        key: key,
        name: script.file.name,
        user: uid
      }
    };
    const uploadTask = storage.put(script.file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      nextFunction,
      errorFunction,
      completeFunction(key));

    return deferred.promise;
  };
}
