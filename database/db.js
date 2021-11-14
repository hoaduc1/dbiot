const admin = require('firebase-admin');
const serviceAccount = require('../firestore-editor.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
module.exports.db = admin.firestore();