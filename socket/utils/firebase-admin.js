// utils/firebase-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('../social-media-a5994-firebase-adminsdk-fbsvc-7a2ed1f71f.json'); // your private key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;