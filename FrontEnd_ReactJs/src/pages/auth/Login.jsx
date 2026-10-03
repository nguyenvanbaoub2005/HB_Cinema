import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getToken } from "../../api/localStorage";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import Logo from "../../assets/images/logo.png";
import { jwtDecode } from "jwt-decode";
import { login } from "../../api/authService";
import "./auth.css"; 

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    const token = getToken();
    handleTokenRedirect(token);
  }, [navigate]);

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

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);  // Set loading to true when login starts
      setError(null);
      const data = await login(username, password);
      console.log(data);
      const token = getToken();
      handleTokenRedirect(token);
    } catch (error) {
      console.error("Error login:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);  // Set loading to false after login attempt
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo-container">
          <img src={Logo} alt="Logo" className="auth-logo" />
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="text-gray-400 text-sm">
              <input
                type="checkbox"
                className="form-checkbox text-orange-500 rounded"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-orange-500 text-sm">
              Forgot password?
            </a>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Loading..." : "LOGIN"} {/* Display loading text */}
          </button>
        </form>
        <div className="auth-divider">or</div>
        <div className="space-y-3">
          <button className="auth-social-button auth-google-button" disabled={loading}>
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
          <button className="auth-social-button auth-facebook-button" disabled={loading}>
            <FaFacebookF className="mr-2" /> Sign in with Facebook
          </button>
        </div>
        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/sign_up"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign up now!
          </Link>
        </p>
      </div>
    </div>
  );
}
