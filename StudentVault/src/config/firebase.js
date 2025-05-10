import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7Wjz9RkatG_1FZkTCvdL84ASYhrlQf6A",
  authDomain: "studentlist-8a3bb.firebaseapp.com",
  projectId: "studentlist-8a3bb",
  storageBucket: "studentlist-8a3bb.firebasestorage.app",
  messagingSenderId: "542248686411",
  appId: "1:542248686411:web:991d6d0cd687c499040ece"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
// const firebaseConfig = {
//   apiKey: "AIzaSyBWPoE3H2axDYa0EHZuTEUDaDj82FrGoJU",
//   authDomain: "student-ms-hackathon.firebaseapp.com",
//   projectId: "student-ms-hackathon",
//   storageBucket: "student-ms-hackathon.appspot.com",
//   messagingSenderId: "428580276583",
//   appId: "1:428580276583:web:4d64af72111dbc87ea87c2",
//   measurementId: "G-JY9YW0TJ4R"
// };