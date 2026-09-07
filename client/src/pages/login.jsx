import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api"; // Adjust the path to your api.js file if necessary
import "../App.css"; // Ensure your CSS is imported

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Calls http://localhost:5000/api/auth/login using your api.js wrapper
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Save token and user information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect user to dashboard or home page
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Shapes */}
      <div className="login-bg-shape login-shape-one"></div>
      <div className="login-bg-shape login-shape-two"></div>
      <div className="login-bg-shape login-shape-three"></div>

      <div className="login-container">
        
        {/* BRAND PANEL */}
        <div className="login-brand-panel">
          <div className="login-brand-logo">
            TechVault<span>360</span>
          </div>

          <div className="login-brand-content">
            <div className="login-mini-badge">SECURE PLATFORM</div>
            <h1>
              Welcome Back to <span>TechVault</span>
            </h1>
            <p>
              Access your digital workspace, manage your projects, and secure your workflows with next-gen authorization.
            </p>

            <div className="login-features">
              <div className="login-feature">
                <div className="login-feature-icon">🛡️</div>
                <div>
                  <strong>Enterprise Security</strong>
                  <small>Encrypted end-to-end sessions</small>
                </div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon">⚡</div>
                <div>
                  <strong>Lightning Fast</strong>
                  <small>Optimized performance pipeline</small>
                </div>
              </div>
            </div>
          </div>

          <div className="login-brand-bottom">
            <span>© 2026 TechVault360</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="login-form-panel">
          <div className="login-card">
            
            <div className="login-header">
              <div className="login-icon">🔒</div>
              <div>
                <span className="login-welcome">START MANAGING</span>
                <h2>Sign In</h2>
                <p>Enter your details to access your account</p>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <span>!</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="login-input-group">
                <label>Email Address</label>
                <div className="login-input-wrapper">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <div className="password-label-row">
                  <label>Password</label>
                  <button type="button" className="forgot-button">
                    Forgot?
                  </button>
                </div>
                <div className="login-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "hide" : "show"}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <span className="secure-login">🔒 SSL Secured</span>
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="login-spinner"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In to Account"
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <div className="register-prompt">
              Don't have an account? <Link to="/register">Create account</Link>
            </div>

            <div className="login-security">
              <span>🛡️ Protected by 256-bit SSL encryption</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}