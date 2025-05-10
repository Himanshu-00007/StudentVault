import React, { useState } from "react";
import { auth, provider } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
// Make sure to import Bootstrap in your index.js or App.js:
// import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate("/students");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-sm col-12 col-md-6 col-lg-4">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h1 className="text-primary fw-bold">StudentVault</h1>
            <h2 className="fs-4 fw-semibold">
              {isRegister ? "Create Account" : "Welcome Back!"}
            </h2>
            <p className="text-muted small">
              {isRegister
                ? "Register to start managing your students"
                : "Login to continue to your dashboard"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="mb-3">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
            
           
            
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isRegister ? "Create Account" : "Login"}
            </button>
          </form>
          
          <div className="d-flex align-items-center my-4">
            <div className="flex-grow-1 border-bottom"></div>
            <div className="mx-3 text-muted small">OR</div>
            <div className="flex-grow-1 border-bottom"></div>
          </div>
          
          <button 
            onClick={signInWithGoogle} 
            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
          
          <div className="text-center mt-4 small text-muted">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <span 
              onClick={() => setIsRegister(!isRegister)} 
              className="text-primary ms-1 fw-medium cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
