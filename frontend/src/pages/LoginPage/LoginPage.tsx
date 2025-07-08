import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginPage.module.css';
import { toast, Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success('Login successful!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.loginPage}>
      <Toaster position="bottom-right" />
      <div className={styles.backgroundElements}>
        {/* Top Left Cluster (2 elements) */}
        <div className={`${styles.decoElement} ${styles.topLeftGalaxy}`}></div>
        <div className={`${styles.decoElement} ${styles.topLeftSparkle}`}></div>

        {/* Top Right Cluster (1 element) */}
        <div className={`${styles.decoElement} ${styles.topRightGalaxy}`}></div>

        {/* Middle Left Cluster (4 elements) */}
        <div className={`${styles.decoElement} ${styles.midLeftSparkle1}`}></div>
        <div className={`${styles.decoElement} ${styles.midLeftSparkle2}`}></div>
        <div className={`${styles.decoElement} ${styles.midLeftSparkle3}`}></div>
        <div className={`${styles.decoElement} ${styles.midLeftSparkle4}`}></div>

        {/* Middle Right Cluster (3 elements) */}
        <div className={`${styles.decoElement} ${styles.midRightSparkle1}`}></div>
        <div className={`${styles.decoElement} ${styles.midRightSparkle2}`}></div>
        <div className={`${styles.decoElement} ${styles.midRightSparkle3}`}></div>
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
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        <p className={styles.registerLink}>
          Don't have an account yet?{' '}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;