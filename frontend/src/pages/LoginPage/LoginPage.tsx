import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./LoginPage.module.css";
import { toast, Toaster } from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      toast.success("Login successful!");
      // Redirect based on email
      if (email === "s2cadmin@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <Toaster position="bottom-right" />
      <Link to="/" className={styles.backButton}>
        &larr; Back to Homepage
      </Link>
      <div className={styles.backgroundElements}>
        {/* Top Left Cluster (2 elements) */}
        <div className={`${styles.decoElement} ${styles.topLeftGalaxy}`}></div>
        <div className={`${styles.decoElement} ${styles.topLeftSparkle}`}></div>

        {/* Top Right Cluster (1 element) */}
        <div className={`${styles.decoElement} ${styles.topRightGalaxy}`}></div>

        {/* Middle Left Cluster (4 elements) */}
        <div
          className={`${styles.decoElement} ${styles.midLeftSparkle1}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midLeftSparkle2}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midLeftSparkle3}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midLeftSparkle4}`}
        ></div>

        {/* Middle Right Cluster (3 elements) */}
        <div
          className={`${styles.decoElement} ${styles.midRightSparkle1}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midRightSparkle2}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midRightSparkle3}`}
        ></div>
      </div>
      <h1 className={styles.title}>STUDY 2 CHALLENGE 2025</h1>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.inputGroup} style={{ position: "relative" }}>
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              style={{ paddingRight: 38 }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 10,
                top: 40,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "#aaa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 24,
                width: 24,
              }}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          <button
            type="submit"
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? <div className={styles.spinner}></div> : "Login"}
          </button>
        </form>
        <p className={styles.registerLink}>
          Don't have an account yet? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
