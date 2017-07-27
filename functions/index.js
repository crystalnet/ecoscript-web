const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const cors = require('cors')({
  origin: true
});

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const PDFJS = require('pdfjs-dist');
//const PDF = require('azure-pdfinfo');

const paypal = require('paypal-rest-sdk');


// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })

exports.generateUploadEntry = functions.storage.object().onChange(event => {
  // The Storage object.
  const object = event.data;
  console.log(event);
  // The File Path
  const filePath = object.name;

  // File metadata
  const metadata = object.metadata;

  // The resourceState is 'exists' or 'not_exits' (for file/folder deletions).
  const resourceState = object.resourceState;
  new XMLHttpRequest();

  let numPages = -1;
  // console.log(object.mediaLink);
  // var pdf = PDF(object.mediaLink);
  //
  // pdf.info(function (err, meta) {
  //   if (err) {
  //     console.log('Error pdfinfo: ', err)
  //   }
  //   console.log('pdf info', meta);
  // });

  numPages = 42;

  // PDFJS.getDocument(object.mediaLink)
  //   .then(function(doc) {
  //     numPages = doc.numPages;
  //   })
  //   .catch(function() {
  //     numPages = 42;
  //   });

  if (resourceState === 'exists') {
    // return;
    return admin.database().ref('scripts/' + metadata.key).set({
      pages: numPages,
      name: metadata.name,
      user: metadata.user,
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
  return null;
});


function initalizePaypal() {
  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYm_7kdkUQYF1earQoDiMzzwDYhVentxVL0EfyAm5hyKuknMxLTio5bKpcBdatDj6MicqmW57GxrvQ9N',
    'client_secret': 'EGDSqchBapiNHR3I74bdMuU0DF5xMitcg4ueM7AYmT7QbVqtgIGYwtZq5O4IgAakYnFe61Cyl'
  });
}


exports.createPayment = functions.https.onRequest((req, res) => {
  const orderId = req.data.orderId;
  const userId = req.data.userId;
  const order = admin.database().ref('order/' + orderId);

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
        'items': [{
          'name': 'item1',
          'sku': 'skusku',
          'price': '1.00',
          'currency': 'EUR',
          'quantity': 2
        }]
      },
      'amount': {
        'currency': 'EUR',
        'total': '4.42'
      },
      'description': 'This is the payment description.'
    }]
  };

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
  const paymentId = req.data.paymentId;

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

