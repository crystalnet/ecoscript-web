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
  // The File Path
  const filePath = object.name;
  // The location for the database entry
  const location = filePath.slice(0, filePath.lastIndexOf('.'));
  // The id of the script
  const id = filePath.split('/').pop();
  // File metadata
  const metadata = object.metadata;
  // File meta
  const fileName = metadata.name ? metadata.name : id;
  // The resourceState is 'exists' or 'not_exits' (for file/folder deletions).
  const resourceState = object.resourceState;
  console.log(location, '--------------------------------', metadata, '------------------------------', fileName);

  if (resourceState === 'exists') {
    // return;
    return admin.database().ref(location).set({
      pages: 42,
      name: fileName,
      id: id
    });
  }
  return null;
});
