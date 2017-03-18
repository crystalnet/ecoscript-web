var functions = require('firebase-functions');
var shortid = require('shortid');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })

exports.generateUploadEntry = functions.storage.object().onChange(event => {
  // The Storage object.
  const object = event.data;
  // const user = event.auth.variable;

  // The Storage bucket that contains the file.
  const fileBucket = object.bucket;
  // File path in the bucket.
  const filePath = object.name;
  // File content type.
  const contentType = object.contentType;
  // The resourceState is 'exists' or 'not_exits' (for file/folder deletions).
  const resourceState = object.resourceState;
  console.log(fileBucket, filePath, contentType, resourceState, event);

  if (resourceState === 'exists') {
    // Remove file extension
    const location = filePath.slice(0, filePath.lastIndexOf('.'));

    return;
    // return admin.database().ref(location).set({
    //   pages: 42
    // });
  } else {
    return;
  }
});
