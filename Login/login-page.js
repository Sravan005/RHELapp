import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import * as Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.5/dist/sweetalert2.all.min.js";
import { getFirestore, setDoc, doc,getDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';


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

var lemail,lpassword;

if(loginbtn){
loginbtn.addEventListener("click", function(event) {
  event.preventDefault()
 
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
      redirectToAnotherPage();
    } else {
      alert("User doesn't exist");
    }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert("Error occurred. Try again." + errorCode + errorMessage);
  });
  });
}

  function redirectToAnotherPage() {
    window.location.href = '../dashboard/dashboard-page.html';

  }


