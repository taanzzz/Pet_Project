import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const inputBase = {
  width: "100%",
  padding: "13px 14px 13px 42px",
  background: "#242018",
  border: "1.5px solid rgba(255,255,255,.08)",
  borderRadius: 12,
  fontSize: 14,
  color: "#F5F0EA",
  outline: "none",
  transition: "all .25s ease",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const focus = (e) => {
    e.target.style.borderColor = "rgba(240,134,106,.55)";
  };
  const blur = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,.08)";
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  if (!email.trim() || !password.trim()) { toast.error('Please fill all fields'); return; }
  try {
    setLoading(true);
    await loginUser(email, password);
    toast.success('Welcome back! 🐾');
    setTimeout(() => navigate(from, { replace: true }), 500);
  } catch (err) {
    toast.error(err?.response?.data?.message || err?.message || 'Invalid email or password');
  } finally {
    setLoading(false);
  }
};
 const handleGoogle = async () => {
  if (loading) return;
  setLoading(true);
  try {
    await googleLogin();
    // Google redirect করবে — এরপর কোনো code চলবে না
  } catch (err) {
    setLoading(false);
    toast.error(err?.message || 'Google login failed');
  }
};
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0E0C0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            background: "#F0866A",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 17,
          }}
        >
          🐾
        </div>
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 20,
            color: "#F5F0EA",
          }}
        >
          PawsHome
        </span>
      </div>

      {/* Card */}
      <div
        className="animate-scaleIn"
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#1C1814",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,.07)",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.45)",
        }}
      >
        {/* Hero */}
        <div
          style={{
            height: 160,
            background:
              "linear-gradient(160deg, #2A1208 0%, #4A1E0C 60%, #3D1A18 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(240,134,106,.06)",
              top: -60,
              right: -40,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                background: "#F0866A",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                margin: "0 auto 10px",
              }}
            >
              🐾
            </div>
            <p
              style={{
                color: "#F0866A",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".1em",
              }}
            >
              PET ADOPTION PLATFORM
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "28px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 26,
                color: "#F5F0EA",
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              Welcome Back
            </h2>
            <p style={{ fontSize: 13, color: "#7A6858" }}>
              Ready to find your new best friend?
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Email */}
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7A6858",
                  display: "block",
                  marginBottom: 7,
                  letterSpacing: ".08em",
                }}
              >
                EMAIL
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#4A3C2E",
                    fontWeight: 500,
                  }}
                >
                  @
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputBase}
                  onFocus={focus}
                  onBlur={blur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7A6858",
                  display: "block",
                  marginBottom: 7,
                  letterSpacing: ".08em",
                }}
              >
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#4A3C2E",
                    fontWeight: 500,
                  }}
                >
                  *
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputBase, paddingRight: 60 }}
                  onFocus={focus}
                  onBlur={blur}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#F0866A",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: ".06em",
                  }}
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 0",
                marginTop: 4,
                background: loading
                  ? "#2C261E"
                  : "linear-gradient(135deg, #F0866A 0%, #D9623E 100%)",
                color: loading ? "#5C4A38" : "#fff",
                border: "none",
                borderRadius: 50,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all .25s ease",
              }}
            >
              {loading ? "Logging in..." : "Login →"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,.08)",
                }}
              />
              <span style={{ fontSize: 11, color: "#5C4A38", fontWeight: 700 }}>
                OR
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,.08)",
                }}
              />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px 0",
                background: "#242018",
                border: "1.5px solid rgba(255,255,255,.09)",
                borderRadius: 50,
                color: "#F5F0EA",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "all .25s ease",
                fontSize: 14,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(240,134,106,.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,.09)";
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <p style={{ textAlign: "center", fontSize: 13, color: "#7A6858" }}>
              New to PawsHome?{" "}
              <Link
                to="/register"
                style={{
                  color: "#F0866A",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>

      <p style={{ marginTop: 20, fontSize: 11, color: "#2C1E14" }}>
        © {new Date().getFullYear()} PawsHome
      </p>
    </div>
  );
};

export default LoginPage;
