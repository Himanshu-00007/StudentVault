// src/pages/Login.jsx
import React, { useState } from "react";
import { auth, provider } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/students");
    } catch (error) {
      alert(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/students");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isRegister ? "Register" : "Login"} to continue</h2>
      <form onSubmit={handleAuth} style={styles.form}>
        <input type="email" name="email" placeholder="Email" required style={styles.input} />
        <input type="password" name="password" placeholder="Password" required style={styles.input} />
        <button type="submit" style={styles.button}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button onClick={signInWithGoogle} style={styles.googleButton}>
        Sign in with Google
      </button>
      <p>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <span onClick={() => setIsRegister(!isRegister)} style={styles.toggle}>
          {isRegister ? "Login" : "Register"}
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    marginTop: "100px",
    padding: "2rem",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
  },
  button: {
    padding: "0.6rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  googleButton: {
    marginTop: "1rem",
    padding: "0.6rem",
    fontSize: "1rem",
    backgroundColor: "#db4437",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  toggle: {
    color: "blue",
    cursor: "pointer",
  },
};

export default Login;
