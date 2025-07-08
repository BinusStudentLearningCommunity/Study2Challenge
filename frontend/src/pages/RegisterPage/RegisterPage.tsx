import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './RegisterPage.module.css';
import { toast, Toaster } from 'react-hot-toast';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    try {
      await register({ name: `${firstName} ${lastName}`, email, password });
      toast.success('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.registerPage}>
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
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.registerButton}>
            Register
          </button>
        </form>
        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;