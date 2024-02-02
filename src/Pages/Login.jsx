import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email:");
    
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent. Check your email to reset your password.");
      } catch (err) {
        console.error(err);
        alert("Error sending password reset email. Please try again.");
      }
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
        <p>
          <button style={{backgroundColor:"#5d5b8d",color:"white", cursor:"pointer" , border:"1px solid black" , borderRadius:"6px"}} onClick={handleForgotPassword}>Forgot Password</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
