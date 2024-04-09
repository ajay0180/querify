const  { initializeApp } = require("firebase/app")  ;
const  { getStorage }  = require( "firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyCB0MajPnqkP7wwjiOU5t04QQug0TGd42U",
  authDomain: "querify-34cd0.firebaseapp.com",
  projectId: "querify-34cd0",
  storageBucket: "querify-34cd0.appspot.com",
  messagingSenderId: "176480220232",
  appId: "1:176480220232:web:5e82abc34799193578947d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("succesfully configured to firebase");

exports.storage = getStorage(app);