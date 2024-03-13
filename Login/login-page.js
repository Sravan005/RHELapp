import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';


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


export var myVariable = "";

const eInput = document.getElementById("email-login");
const pInput = document.getElementById("password-login");
const loginbtn = document.getElementById("login-btn");

var lemail, lpassword;

if (loginbtn) {
  loginbtn.addEventListener("click", function (event) {
    event.preventDefault()
    const popup2 = document.getElementById("popup2");
    const closeButton2 = popup2.querySelector(".close-popup2");
    const popupContent2 = popup2.querySelector(".popup-content2");

    popupContent2.innerHTML = `
  <span class="close-popup2">&times;</span>
  <p>Login successful</p>
`;
    popup2.style.display = "block";
    closeButton2.addEventListener("click", function () {
      popup2.style.display = "none";
    });

    lemail = eInput.value;
    lpassword = pInput.value;
    signInWithEmailAndPassword(auth, lemail, lpassword)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const db = getFirestore(app);
        const userDocRef = doc(db, "users", user.uid); // Update the path to "users"
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {

          const userName = userDoc.data().name;
          myVariable = userName;
          localStorage.setItem('myVariable', userName);
          console.log("Username:", userName);
          sessionStorage.setItem("auth", "true");
          redirectToAnotherPage();
        } else {
          sessionStorage.setItem("auth", "false");
          alert("User doesn't exist");
          popup2.style.display = "none";
        }
      })
      .catch((error) => {
        popup2.style.display = "none";
        const errorCode = error.code;
        const errorMessage = error.message;
        const popup = document.getElementById("popup");
        const popupContent = popup.querySelector(".popup-content");


        // Update popup content with error details
        popupContent.innerHTML = `
        <span class="close-popup">&times;</span>
        <p>Error Code: ${errorCode}</p>
        <p>Error Message: ${errorMessage}</p>
    `;

        // Display the popup
        popup.style.display = "block";

        // Close the popup when the close button is clicked
        const closeButton = popup.querySelector(".close-popup");

        closeButton.addEventListener("click", function () {
          popup.style.display = "none";
        });

      });
  });
}

function redirectToAnotherPage() {
  window.location.href = '../dashboard/dashboard-page.html';

}


