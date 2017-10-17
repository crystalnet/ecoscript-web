const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const cors = require('cors')({
  origin: true
});

const PDFJS = require('pdfjs-dist');

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


exports.generateUploadEntry = functions.storage.object().onChange(event => {
  // The File Path
  const filePath = event.data.name;
  // File metadata
  const metadata = event.data.metadata;
  // The resourceState is 'exists' or 'not_exits' (for file/folder deletions).
  const resourceState = event.data.resourceState;
  let numPages = -1;
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);

  // Cloud Storage files.
  const bucket = gcs.bucket(event.data.bucket);
  const file = bucket.file(filePath);

  if (resourceState === 'exists') {
    admin.database().ref('scripts/' + metadata.key).set({
      name: metadata.name,
      user: metadata.user
    });

    // Create the temp directory where the storage file will be downloaded.
    return mkdirp(tempLocalDir).then(() => {
      console.log('created temp directory: ' + tempLocalDir);
      // Download file from bucket.
      return file.download({destination: tempLocalFile}).then(() => {
        console.log('downloaded file: ' + tempLocalFile);
        // Analyze file with pdfjs
        return PDFJS.getDocument(tempLocalFile).then(function(doc) {
          numPages = doc.numPages;

          return admin.database().ref('scripts/' + metadata.key).update({
            pages: numPages
          });
        }, function(err) {
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
  }
});


exports.updatePrices = functions.database.ref('/order_items/{orderItemId}')
  .onUpdate(event => {
    let snapshot = event.data;
    if (snapshot.child('color').changed() || snapshot.child('pagesPerSide').changed() || snapshot.child('twoSided').changed()) {
      return admin.database().ref('scripts/' + snapshot.child('script').val() + '/pages').once('value').then(function(pages) {
        let divisor = snapshot.child('pagesPerSide/value').val();
        if (snapshot.child('twoSided/value').val() === 'true') {
          divisor *= 2;
        }
        let pagePrice;
        let fixedCosts = 1;
        if (snapshot.child('color/value').val() === 'color') {
          pagePrice = 0.10;
        } else {
          pagePrice = 0.05;
        }
        let price = Math.ceil(pages.val() / divisor) * pagePrice + fixedCosts;
        price = Math.round(price * 100)/100;
        return snapshot.adminRef.update({price: price}).then(function() {
          return updateOrderTotal(snapshot.child('order').val());
        });
      });
    }
  });


function updateOrderTotal(orderId) {
  let orderReference = admin.database().ref('orders/' + orderId);
  return orderReference.child('order_items').once('value').then(function(orderSnapshot) {
    let promises = [];
    let total = 0;
    orderSnapshot.forEach(function(childSnapshot) {
      promises.push(admin.database().ref('order_items/' + childSnapshot.key).once('value').then(function(itemSnapshot) {
        total += itemSnapshot.child('price').val();
      }));
    });
    return Promise.all(promises).then(function() {
      return orderReference.update({total: total});
    });
  });
}


function initalizePaypal() {
  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYm_7kdkUQYF1earQoDiMzzwDYhVentxVL0EfyAm5hyKuknMxLTio5bKpcBdatDj6MicqmW57GxrvQ9N',
    'client_secret': 'EGDSqchBapiNHR3I74bdMuU0DF5xMitcg4ueM7AYmT7QbVqtgIGYwtZq5O4IgAakYnFe61Cyl-Uy_2zY'
  });
}


// function updatePrices(orderId) {
//   let promises = [];
//   promises.push(admin.database().ref('orders/' + orderId + '/price').set('42'));
//   admin.database().ref('orders/' + orderId + '/order_items').once('value').then(function(snapshot) {
//     snapshot.forEach(function(childSnapshot) {
//       promises.push(admin.database().ref('order_items/' + childSnapshot.key + '/price').set('1'));
//     });
//   });
//   return Promise.all(promises);
// }


exports.createPayment = functions.https.onRequest((req, res) => {
  initalizePaypal();
  const orderId = req.body.orderId;
  const userId = req.body.userId;
  updateOrderTotal(orderId);
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
        'currency': 'EUR'
      },
      'description': 'This is the payment description.'
    }]
  };

  admin.database().ref('orders/' + orderId).once('value').then(function(orderSnapshot) {
    createPaymentJson.transactions[0].amount.total = orderSnapshot.child('total').val();
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
  }).then(function() {
    paypal.payment.create(createPaymentJson, function(error, payment) {
      cors(req, res, () => {
        if (error) {
          console.log(error);
          res.status(400).send([error, createPaymentJson]);
        } else {
          admin.database().ref('orders/' + orderId + '/payment').set(payment.id);
          console.log('Create Payment Response');
          console.log(payment);
          res.status(200).send(payment);
        }
      });
    });
  });
});


exports.patchPayment = functions.https.onRequest((req, res) => {
  initalizePaypal();
  const orderId = req.body.orderId;
  let paymentId = '';
  let patchPaymentJson = [{
    'op': 'add',
    'path': '/transactions/0/item_list/shipping_address',
    'value': {
      'country_code': 'DE'
    }
  }];

  admin.database().ref('orders/' + orderId).once('value').then(function(orderSnapshot) {
    paymentId = orderSnapshot.child('payment').val();
    patchPaymentJson[0].value.recipient_name = orderSnapshot.child('particulars/firstname').val()
      + ' ' + orderSnapshot.child('particulars/lastname').val();
    patchPaymentJson[0].value.line1 = orderSnapshot.child('particulars/street').val();
    patchPaymentJson[0].value.city = orderSnapshot.child('particulars/city').val();
    patchPaymentJson[0].value.postal_code = orderSnapshot.child('particulars/zip').val();
  }).then(function() {
    console.log(paymentId);
    console.log(patchPaymentJson);
    paypal.payment.update(paymentId, patchPaymentJson, function(error, payment) {
      cors(req, res, () => {
        if (error) {
          console.log(error);
          res.status(400).send([error, patchPaymentJson]);
        } else {
          console.log('Patch Payment Response');
          console.log(payment);
          res.status(200).send(payment);
        }
      });
    });
  });
});

exports.executePayment = functions.https.onRequest((req, res) => {
  initalizePaypal();
  const orderId = req.body.orderId;
  const payerId = req.body.payerId;
  let executePaymentJson = {
    'payer_id': 'Appended to redirect url'
  };

  const paymentId = admin.database().ref('orders/' + orderId + '/payment').once('value').then(function() {
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
});

