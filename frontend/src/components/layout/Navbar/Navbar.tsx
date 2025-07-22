import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleRegisterButtonClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false); 
  }

  return (
		<div className={styles.navbarContainer}>
			<nav className={styles.navbar}>
				<div className={styles.navbarBrand}>
					<Link to="/" className={styles.brandLink}>
						Logo Study2Challenge
					</Link>
				</div>
				<button
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`${styles.navbarNav} ${isMenuOpen ? styles.active : ''}`}>
          <li className={styles.navItem}>
            <button onClick={() => scrollToSection('Hero')} className={styles.navLink}>
              Tentang S2C
            </button>
          </li>
          <li className={styles.navItem}>
            <button onClick={() => scrollToSection('WhyJoin')} className={styles.navLink}>
              Manfaat
            </button>
          </li>
          <li className={styles.navItem}>
            <button onClick={() => scrollToSection('Timeline')} className={styles.navLink}>
              Timeline
            </button>
          </li>
          <li className={styles.navItem}>
            <button onClick={() => scrollToSection('Faq')} className={styles.navLink}>
              FAQ
            </button>
          </li>

          <div className={styles.mobileActions}>
            {isAuthenticated ? (
              <>
                <li className={`${styles.navItem} ${styles.navActionItem}`}>
                  <Link to="/dashboard" className={styles.dashboardButton}>DASHBOARD</Link>
                </li>
                <li className={`${styles.navItem} ${styles.navActionItem}`}>
                  <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                </li>
              </>
            ) : (
              <li className={`${styles.navItem} ${styles.navActionItem}`}>
                <button onClick={handleRegisterButtonClick} className={styles.registerButton}>DAFTAR TIM</button>
              </li>
            )}
          </div>
        </ul>
        <div className={styles.navActions}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={styles.dashboardButton}>DASHBOARD</Link>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <button onClick={handleRegisterButtonClick} className={styles.registerButton}>DAFTAR TIM</button>
          )}
        </div>
			</nav>
		</div>
  );
};

export default Navbar;