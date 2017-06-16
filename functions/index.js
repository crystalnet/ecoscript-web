const functions = require('firebase-functions');
// const PDFJS = require('pdfjs');
const PDF = require('azure-pdfinfo');
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

  // File metadata
  const metadata = object.metadata;

  // The resourceState is 'exists' or 'not_exits' (for file/folder deletions).
  const resourceState = object.resourceState;

  let numPages = -1;
  console.log(object.mediaLink);
  var pdf = PDF(object.mediaLink);

  pdf.info(function(err, meta) {
    if (err) console.log('Error pdfinfo: ', err);
    console.log('pdf info', meta);
  });


  // PDFJS.getDocument(object.mediaLink)
  //   .then(function (doc) {
  //     numPages = doc.numPages;
  //   })
  //   .catch(function () {
  //     numPages = 42;
  //   });

  if (resourceState === 'exists') {
    // return;
    return admin.database().ref('scripts/' + metadata.key).set({
      pages: 42,
      name: metadata.name,
      user: metadata.uid
    });
  }
  return null;
});
