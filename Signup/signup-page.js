import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyBwqeerfgu8xdW3crXGcxQ7IT15hHzc0Dw",
  authDomain: "uplifted-kit-368217.firebaseapp.com",
  databaseURL: "https://uplifted-kit-368217-default-rtdb.firebaseio.com",
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
          const popup2 = document.getElementById("popup2");
          const closeButton2 = popup2.querySelector(".close-popup2");
        
         
          const popupContent2 = popup2.querySelector(".popup-content2");
        
          popupContent2.innerHTML = `
          <span class="close-popup2">&times;</span>
          <p>Account Registered!</p>
        `;
        popup2.style.display = "block";
          closeButton2.addEventListener("click", function() {
            popup2.style.display = "none";
        });      
          setDoc(userRef, {
            email: semail,
            name: displayName
          }).then(() => {
            console.log("Data successfully written:", userRef);
            // alert("Success! Account created." + displayName);
            redirectToAnotherPage();
          }).catch((error) => {
            console.error("Error writing data:", error);
            window.alert("Error occurred. Try again.");
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const popup = document.getElementById("popup");
          const popupContent = popup.querySelector(".popup-content");
          
          const errorCodeSpan = document.getElementById("errorCode");
          const errorMessageSpan = document.getElementById("errorMessage");
          
          
          popupContent.innerHTML = `
              <span class="close-popup">&times;</span>
              <p> ${errorCode}</p>
              <p>${errorMessage}</p>
          `;
          
          // Display the popup
          popup.style.display = "block";
          
          // Close the popup when the close button is clicked
          const closeButton = popup.querySelector(".close-popup");
          
          closeButton.addEventListener("click", function() {
          popup.style.display = "none";
          });
        });
    }
  });
}
});

function redirectToAnotherPage() {
window.location.href = '/Login/login-page.html';
}















