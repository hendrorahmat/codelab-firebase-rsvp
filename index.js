// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

var rsvpListener = null;
var guestbookListener = null;

// Add Firebase project configuration object here
 const firebaseConfig = {
  apiKey: "AIzaSyCumByuBZnM0YWn65TPmQZHgFQ5sslbXwU",
  authDomain: "fir-web-codelab-f1d96.firebaseapp.com",
  databaseURL: "https://fir-web-codelab-f1d96.firebaseio.com",
  projectId: "fir-web-codelab-f1d96",
  storageBucket: "fir-web-codelab-f1d96.appspot.com",
  messagingSenderId: "311512642131",
  appId: "1:311512642131:web:6fd7cc9161dfc4fd814ca6",
  measurementId: "G-9C2NYPBTLV"
};

firebase.initializeApp(firebaseConfig);

// FirebaseUI config
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    // Email / Password Provider.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl){
      // Handle sign-in.
      // Return false to avoid redirect.
      return false;
    }
  }
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

startRsvpButton.addEventListener("click",
 () => {
      ui.start("#firebaseui-auth-container", uiConfig);
});

firebase.auth().onAuthStateChanged((user)=> {
  if (user) {
    startRsvpButton.textContent = "LOGOUT"
  }
  else {
    startRsvpButton.textContent = "RSVP"
  }
});

startRsvpButton.addEventListener("click",
 () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
    } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
});

firebase.auth().onAuthStateChanged((user) => {
 if (user){
   startRsvpButton.textContent = "LOGOUT";
   // Show guestbook to logged-in users
   guestbookContainer.style.display = "block";
 }
 else{
   startRsvpButton.textContent = "RSVP";
   // Hide guestbook for non-logged-in users
   guestbookContainer.style.display = "none";
 }
});

form.addEventListener("submit", (e) => {
 // Prevent the default form redirect
  e.preventDefault();
 // Write a new message to the database collection "guestbook"
 firebase.firestore().collection("guestbook").add({
   text: input.value,
   timestamp: Date.now(),
   name: firebase.auth().currentUser.displayName,
   userId: firebase.auth().currentUser.uid
 })
 // clear message input field
 input.value = ""; 
 getDataGuestBook()
 // Return false to avoid redirect
 return false;
});

function getDataGuestBook() {
  firebase.firestore().collection("guestbook")
    .orderBy("timestamp","desc")
    .onSnapshot((snaps) => {
    // Reset page
    guestbook.innerHTML = "";
    // Loop through documents in database
    snaps.forEach((doc) => {
      // Create an HTML entry for each document and add it to the chat
        const entry = document.createElement("p");
        entry.textContent = doc.data().name + ": " + doc.data().text;
        guestbook.appendChild(entry);
    });
  });
}

getDataGuestBook()