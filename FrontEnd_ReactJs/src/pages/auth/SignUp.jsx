import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { addUser } from "../../api/apiUser";
import { jwtDecode } from "jwt-decode";
import { login } from "../../api/authService";
import { getToken } from "../../api/localStorage";
import "./auth.css"; 

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const handleTokenRedirect = (token) => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.scope;
      if (userRole === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else if (userRole === "ROLE_STAFF") {
        navigate("/admin/sell-ticket");
      } else {
        navigate("/");
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (!email) {
      setError("Email cannot be empty.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Invalid email format.");
      return;
    }
    if (!username) {
      setError("Username cannot be empty.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const newUser = { email, username, password };

    try {
      setLoading(true); // Set loading to true when sign-up starts
      setError(null);
      setSuccess(false);
      const result = await addUser(newUser);
      const data = await login(username, password);
      const token = getToken();
      handleTokenRedirect(token);
      console.log("User added successfully:", result);
      setSuccess(true);
    } catch (error) {
      console.error("Error adding user:", error.message);
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false after the request finishes
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your email"
            className="auth-input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="auth-input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="auth-input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">User registered successfully!</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating..." : "SIGN UP"} {/* Show loading state text */}
          </button>
        </form>
        <div className="auth-divider">or</div>
        <div className="space-y-3">
          <button className="auth-social-button auth-google-button" disabled={loading}>
            <FaGoogle className="mr-2" /> Sign up with Google
          </button>
          <button className="auth-social-button auth-facebook-button" disabled={loading}>
            <FaFacebookF className="mr-2" /> Sign up with Facebook
          </button>
        </div>
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-500 font-semibold hover:underline"
          >
            Login in here!
          </Link>
        </p>
      </div>
    </div>
  );
}
