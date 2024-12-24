import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import '../css/login.css';
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  const handleFacebookLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          axios.post("http://localhost:8000/facebook/token", { token: accessToken })
            .then((res) => {
              if (res.data.success) {
                setLogin(true);
                localStorage.setItem("token", res.data.token); // Save the token
                navigate("/"); // Redirect to home page
              } else {
                Swal.fire({
                  title: "Facebook Login Failed",
                  text: res.data.message,
                  icon: "error",
                });
              }
            })
            .catch((error) => {
              console.error("Facebook Login Error:", error);
            });
        } else {
          Swal.fire({
            title: "Login Cancelled",
            text: "You cancelled the Facebook login process.",
            icon: "error",
          });
        }
      },
      { scope: "email" }
    );
  };

  const submit = (evt) => {
    evt.preventDefault();

    const loginData = { email, password };

    axios.post('http://localhost:8000/api/login', loginData, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setLogin(true);
          localStorage.setItem("token", "access");
        } else {
          Swal.fire({
            title: "Login Failed",
            text: res.data.user,
            icon: "error",
          }).then(() => {
            window.location.href = "/login";
          });
        }
      });
  };

  const handleGoogleSuccess = (response) => {
    const googleToken = response.credential;
    axios.post('http://localhost:8000/google/token', { token: googleToken }, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setLogin(true);
          localStorage.setItem("token", res.data.token);  // Save the token
          navigate("/");  // Redirect to home page
        } else {
          Swal.fire({
            title: "Google Login Failed",
            text: res.data.message,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Google Login Error:", error);
      });
  };

  const handleGoogleFailure = (error) => {
    console.log("Google Login Error:", error);
  };

  if (login) {
    navigate("/");
  }

  return (
    <>
      <div className="main_div">
        <div className="title">Login Form</div>
        <form onSubmit={submit}>
          <div className="input_box">
            <input
              type="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email"
              required
            />
            <div className="icon">
              <i className="fas fa-user"></i>
            </div>
          </div>
          <div className="input_box">
            <input
              type="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="Enter your password"
              required
            />
            <div className="icon">
              <i className="fas fa-lock"></i>
            </div>
          </div>
          <div className="option_div">
            <div className="check_box">
              <input type="checkbox" />
              <span>Remember me</span>
            </div>
            <div className="forget_div">
              <a href="#">Forgot password?</a>
            </div>
          </div>
          <div className="input_box button">
            <input type="submit" value="Login" />
          </div>
          <div className="sign_up">
            Not a member? <a href="/register">Signup now</a>
          </div>
        </form>
        <br></br>
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            redirectUri="http://localhost:8000/login/google/callback"
          />
        </div>
        <br></br>
        <div className="facebook-login">
          <button onClick={handleFacebookLogin} className="facebook-button">
            <img src="https://e7.pngegg.com/pngimages/991/568/png-clipart-facebook-logo-computer-icons-facebook-logo-facebook.png" width="30px" height="20px"></img>Login with Facebook
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
