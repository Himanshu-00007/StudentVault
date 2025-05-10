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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="app-title">StudentTracker</h1>
          <h2 className="auth-title">{isRegister ? "Create Account" : "Welcome Back!"}</h2>
          <p className="auth-subtitle">
            {isRegister
              ? "Register to start managing your students"
              : "Login to continue to your dashboard"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>
          
          {!isRegister && (
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-button primary-button"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : isRegister ? "Create Account" : "Login"}
          </button>
        </form>
        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <button 
          onClick={signInWithGoogle} 
          className="auth-button google-button"
          disabled={isLoading}
        >
          <svg className="google-icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
        
        <div className="auth-switch">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <span 
            onClick={() => setIsRegister(!isRegister)} 
            className="switch-text"
          >
            {isRegister ? " Login" : " Register"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Add this to your CSS file or styled-components
const styles = `
:root {
  --primary-color: #4361ee;
  --primary-hover: #3a56d4;
  --secondary-color: #f8f9fa;
  --text-color: #333;
  --text-light: #6c757d;
  --border-color: #dee2e6;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --radius: 8px;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-title {
  color: var(--primary-color);
  font-size: 1.75rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.auth-title {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.auth-subtitle {
  color: var(--text-light);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 1rem;
  transition: border 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
}

.forgot-password {
  text-align: right;
  margin-bottom: 0.5rem;
}

.forgot-password a {
  color: var(--primary-color);
  font-size: 0.85rem;
  text-decoration: none;
}

.auth-button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
}

.primary-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: var(--text-light);
  font-size: 0.9rem;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 1rem;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.google-button:hover:not(:disabled) {
  background-color: var(--secondary-color);
}

.google-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.auth-switch {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-light);
}

.switch-text {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 500;
}

`;

// Add this to your component
React.useEffect(() => {
  // Create style element
  const styleEl = document.createElement('style');
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);
  
  // Clean up
  return () => {
    document.head.removeChild(styleEl);
  };
}, []);

export default Login;
