import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyBwqeerfgu8xdW3crXGcxQ7IT15hHzc0Dw",
  authDomain: "uplifted-kit-368217.firebaseapp.com",
  projectId: "uplifted-kit-368217",
  storageBucket: "uplifted-kit-368217.appspot.com",
  messagingSenderId: "954331177043",
  appId: "1:954331177043:web:d95312f73d13930976e6a6",
  measurementId: "G-SB8YYCMPE0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function () {
  const displayNameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const conpasswordInput = document.getElementById("confirmpassword");
  const createacctbtn = document.getElementById("signupsubmit");

  var semail, spassword, sconpassword, displayName;

  if (createacctbtn) {
    createacctbtn.addEventListener("click", function (event) {
      event.preventDefault();
      var isVerified = true;
      displayName = displayNameInput.value;
      semail = emailInput.value;
      spassword = passwordInput.value;
      sconpassword = conpasswordInput.value;

      if (spassword != sconpassword) {
        window.alert("Password fields do not match. Try again.");
        isVerified = false;
      }
      if (semail == null || spassword == null || sconpassword == null) {
        window.alert("Please fill out all required fields.");
        isVerified = false;
      }

      if (isVerified) {
        createUserWithEmailAndPassword(auth, semail, spassword)
        .then((userCredential) => {
          const user = userCredential.user;
          const userRef = doc(db, "users/" + user.uid);
          // const userDocRef = doc(db, "users", user.uid);

          setDoc(userRef, {
            email: semail,
            name: displayName
          }).then(() => {
            console.log("Data successfully written:", userRef);
            alert("Success! Account created." + displayName);
            redirectToAnotherPage();
          }).catch((error) => {
            console.error("Error writing data:", error);
            window.alert("Error occurred. Try again.");
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          window.alert("Error occurred. Try again." + errorCode + errorMessage);
        });
    }
  });
}
});

function redirectToAnotherPage() {
window.location.href = '/Login/login-page.html';
}