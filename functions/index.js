const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const cors = require('cors')({
  origin: true
});

//const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const PDFJS = require('pdfjs-dist');
//const PDF = require('azure-pdfinfo');

const paypal = require('paypal-rest-sdk');

const credentials = {
  'type': 'service_account',
  'project_id': 'scripteco-prod',
  'private_key_id': 'e5994009ec626c87a2f24e333c6e12034f4a3a26',
  'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEgXVpjfdT0ult\naFDA3vrlw82VIZWnah7bjUAvCV2yRjF8mdukuYQHOG4l018ZncKBlE599KlK481X\n/cs6NTJ7dQkJ0AgAHqdMHSp2XXuGaOVomPVHAYufHUABBZ/GgeKnCkNSE0+Dgy7b\nyrckFqjy7AteGddi9Cp5lEnj2fogQm6XGC/KKR3VV7S8KtzT0npgOkaNlp25GvqV\nUux4WDswbzrmmypBvJ9vuyyrIDbu6VCvxFvUAvMg69TbMpmiEwryswrVxm3bP4iT\na4IDEYz/KuTD9xWO0sRmkXJLt66RozONEAY974nITDIDQIZvEzElHSW9Rwjnfe5R\n+MIcS7/hAgMBAAECggEAArvNDgZKvnKWuxYWWP+FGJ8JICno4LzE//+CmQDpqfQo\nZjQG+l83DSlpnVq31gWz/ezZ7G5D0GITwkWKXyV8Lbvcn8OCR/ulLsWxWHcPk8in\n59UIZPfqWQDdegIptUeLZ1DZC8ZPXuxLUaUL2At9Z081r4X/IT4VrO4tWrdGn64c\nojxZCxo+F9vlHjHDlKCwtBpUAceVr2M7iPFiHr3xj/mUE6cn5gbvwcwIu2Z9Tv3A\ndJcKiLTdNr3l2slA/1ecnhAFNyksTITP/SNFKTVwg9hI7ZtXJa2QVa4WMKkvZYeI\n2iIUGh1GbKYnQrBTzOQQ2Ka+nYc9TtDhFZgOaKzxAQKBgQD24HNaO+Zzm0LXCMGu\nC+QV4VgDWD+wUlTNasoCxEztEmNOBR0hzoRYffP4RYJDdsZidjeuTdBrQOVdhIWL\nMn22J+kB0atVucNMmdA3ok3TV8zca5Uk6/Ncw85prNUqYgj3oFiI37cmaWiexesK\nuniHwEE5iCnYsMIVhmu8PbRcgQKBgQDLxHp17D9YgPOCnAPTQPMFPYlpa1UTs/tJ\nWsjqypPu5aeGiQK/jJcx3yVr+m4snfl+JKGLfuPghl3fYA1g0rWd5BwtpPbUeY3s\nIxeMKSxmZ7MtmVRWdJZJ2vqHGm+VaY3Ok7SrGfxbUatsZLVuclsZgwTzGSCskv5a\nkQAGxQczYQKBgGMloS4MAHFNWXqiuaX8gI2JAp/VQT6+0e/tg1O5ImvThq4+v4Rk\nPCKN8v0ybS5K9UF12MbX2Ww5k+QK5NcSYApX3OwuGHFFOXn6C/VL6ZWHHW8oha1e\nVU5cFPm7v6BV3uQUMXpG3nc+vhWFxu94FA/w1kEUvjmYQ1oBsiLXZSgBAoGBALAE\nlVRwM3gcTD2yz4sZO9R3B9BMqz1N5+/BwHUxcQCY2VHZ4MnehGzMOeNAfROFkxNo\nSTPa9LXq3AQtUOEmo0Q03DKBocaBChvFZH3qwzPiuGDXZocYRwqdYnR6XZFPkPO1\nnAeBdwDbV51WkXNKzW8IQqpMNnFcuOM7Bi7S3BmBAoGBAKapDbqThDB7yi0ROfNq\nWPYKsJe1ARM7iId5V8kT+1cxqWh5/ohKDYeordcvL3z8PGL6OC/lLKje/n9XOIXA\nvTgnX8vg2rAoYVNH8J2KnQAXrLD4anJrOLqDCf+gymlYsbS1BsbV4sOsIwVwq1d+\nyftcejY5+linPf5f8Rd9Zy2T\n-----END PRIVATE KEY-----\n',
  'client_email': 'scripteco-prod@appspot.gserviceaccount.com',
  'client_id': '116480264804204646228',
  'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
  'token_uri': 'https://accounts.google.com/o/oauth2/token',
  'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
  'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/scripteco-prod%40appspot.gserviceaccount.com'
};

const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')({credentials: credentials});
const path = require('path');
const os = require('os');


// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })

exports.generateUploadEntry = functions.storage.object().onChange(event => {
  console.log(event);
  // The File Path
  const filePath = event.data.name;

  // File metadata
  const metadata = event.data.metadata;

  // The resourceState is 'exists' or 'not_exits' (for file/folder deletions).
  const resourceState = event.data.resourceState;

  admin.database().ref('scripts/' + metadata.key).set({
    name: metadata.name,
    user: metadata.user
  });

  let numPages = -1;
  console.log(event.data.mediaLink);

  // const pdf = PDF(event.data.mediaLink);
  // pdf.info(function (err, meta) {
  //   if (err) {
  //     console.log('Error pdfinfo: ', err)
  //   }
  //   console.log('pdf info', meta);
  // });

  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);

  // Cloud Storage files.
  const bucket = gcs.bucket(event.data.bucket);
  const file = bucket.file(filePath);
  console.log(file);

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    console.log('created temp directory: ' + tempLocalDir);
    // Download file from bucket.
    return file.download({destination: tempLocalFile}).then(() => {
      console.log('downloaded file: ' + tempLocalFile);
      // Analyze file with pdfjs
      return PDFJS.getDocument(tempLocalFile).then(function(doc) {
        console.log('i am here');
        console.log(doc);
        numPages = doc.numPages;

        if (resourceState === 'exists') {
          // return;
          return admin.database().ref('scripts/' + metadata.key).update({
            pages: numPages,
            prices: {
              '1b': 10.00,
              '2b': 5.00,
              '4b': 2.50,
              '8b': 1.25,
              '16b': 0.63,
              '1c': 20.00,
              '2c': 10.00,
              '4c': 5.00,
              '8c': 2.50,
              '16c': 1.25
            }
          });
        }
      }, function(err) {
        console.log('i am there');
        numPages = 42;
        console.log(err);
        return null;
      });
    }, function(err) {
      console.log('file not downloaded');
      console.log(err);
    });
  }, function(err) {
    console.log('temp dir not created');
    console.log(err);
  });
});


function initalizePaypal() {
  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYm_7kdkUQYF1earQoDiMzzwDYhVentxVL0EfyAm5hyKuknMxLTio5bKpcBdatDj6MicqmW57GxrvQ9N',
    'client_secret': 'EGDSqchBapiNHR3I74bdMuU0DF5xMitcg4ueM7AYmT7QbVqtgIGYwtZq5O4IgAakYnFe61Cyl-Uy_2zY'
  });
}


exports.createPayment = functions.https.onRequest((req, res) => {
  try {
    let createPaymentJson = {
      'intent': 'sale',
      'payer': {
        'payment_method': 'paypal'
      },
      'redirect_urls': {
        'return_url': 'https://script.eco/thankyou',
        'cancel_url': 'https://script.eco/order'
      },
      'transactions': [{
        'item_list': {
          'items': []
        },
        'amount': {
          'currency': 'EUR',
          'total': '99.99'
        },
        'description': 'This is the payment description.'
      }]
    };

    const orderId = req.body.orderId;
    const userId = req.body.userId;

    admin.database().ref('orders/' + orderId).once('value').then(function(orderSnapshot) {
      orderSnapshot.child('order_items').forEach(function(childSnapshot) {
        admin.database().ref('order_items/' + childSnapshot.key).once('value').then(function(itemSnapshot) {
          let item = {
            name: itemSnapshot.child('title').val(),
            sku: itemSnapshot.child('script').val(),
            price: itemSnapshot.child('price').val(),
            currency: 'EUR',
            quantity: '1'
          };
          createPaymentJson.transactions[0].item_list.items.push(item);
        });
      });
      createPaymentJson.total = orderSnapshot.child('price').val();
    });

    initalizePaypal();

    paypal.payment.create(createPaymentJson, function(error, payment) {
      cors(req, res, () => {
        if (error) {
          console.log(error);
          res.status(400).send(error);
        } else {
          console.log('Create Payment Response');
          console.log(payment);
          res.status(200).send(payment);
        }
      });
    });
  } catch (e) {
    cors(req, res, () => {
      console.log('error somewhere');
      console.log(e);
      res.status(400).send(e);
    });
  }
});


exports.patchPayment = functions.https.onRequest((req, res) => {
  let patchPaymentJson = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal'
    },
    'redirect_urls': {
      'return_url': 'https://script.eco/thankyou',
      'cancel_url': 'https://script.eco/order'
    },
    'transactions': [{
      'shipping_address': {
        'recipient_name': 'Brian Robinson',
        'line1': '4th Floor',
        'line2': 'Unit #34',
        'city': 'San Jose',
        'country_code': 'US',
        'postal_code': '95131',
        'phone': '011862212345678',
        'state': 'CA'
      }
    }]
  };

  initalizePaypal();

  paypal.payment.patch(patchPaymentJson, function(error, payment) {
    cors(req, res, () => {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        console.log('Patch Payment Response');
        console.log(payment);
        res.status(200).send(payment);
      }
    });
  });
});

exports.executePayment = functions.https.onRequest((req, res) => {
  const paymentId = req.body.paymentId;

  let executePaymentJson = {
    'payer_id': 'Appended to redirect url',
    'transactions': [{
      'amount': {
        'currency': 'USD',
        'total': '1.00'
      }
    }]
  };

  initalizePaypal();

  paypal.payment.execute(paymentId, executePaymentJson, function(error, payment) {
    cors(req, res, () => {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        console.log('Execute Payment Response');
        console.log(payment);
        res.status(200).send(payment);
      }
    });
  });
});

