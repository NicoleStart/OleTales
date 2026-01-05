/* =========================
   OLETALES APP LOGIC - SECURE VERSION
   ========================= */

/* ---------- FIREBASE CONFIG ---------- */

const firebaseConfig = {
  apiKey: "AIzaSyDTc2lm15qGtCg3r5T36rQYStrltK_SlMk",
  authDomain: "oletales-29202.firebaseapp.com",
  projectId: "oletales-29202",
  storageBucket: "oletales-29202.firebasestorage.app",
  messagingSenderId: "540760611740",
  appId: "1:540760611740:web:29b998a80d0089ea010659",
  measurementId: "G-F7PJGRPPJ5"
};



// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const auth = firebase.auth();

//Author registration
function registerAuthor() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      message.innerText = "Author registered successfully!";
      document.getElementById("uploadSection").style.display = "block";
    })
    .catch(error => {
      message.innerText = error.message;
    });
}


/* =========================
   LOAD STORIES FROM FIRESTORE
   ========================= */




function uploadBook() {
  console.log("Upload button clicked");

  const title = document.getElementById("bookTitle").value;
  const content = document.getElementById("bookContent").value;
  const uploadMessage = document.getElementById("uploadMessage");

  const user = auth.currentUser;
  console.log("Current user:", user);

  if (!user) {
    uploadMessage.innerText = "You must be logged in.";
    return;
  }

  db.collection("books").add({
    title: title,
    content: content,
    authorId: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Upload success");
    uploadMessage.innerText = "Book uploaded successfully!";
  })
  .catch(error => {
    console.error("Upload error:", error);
    uploadMessage.innerText = error.message;
  });
}



