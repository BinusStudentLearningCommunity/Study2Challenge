import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useState } from 'react';

const Navbar = () => {
  const isLoggedIn = false;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
		<div className={styles.navbarContainer}>
			<nav className={styles.navbar}>
				<div className={styles.navbarBrand}>
					<Link to="/" className={styles.brandLink}>
						Logo "STUDY 2 CHALLENGE 2025"
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
          {isLoggedIn ? (
            <>
              <li className={styles.navItem}>
                <Link to="/dashboard" className={styles.navLink}>
                  Dashboard
                </Link>
              </li>
              <li className={styles.navItem}>
                <button className={styles.navLinkButton}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className={styles.navItem}>
                <button
                  onClick={() => scrollToSection('Hero')}
                  className={styles.navLink}
                >
                  Tentang S2C
                </button>
              </li>
              <li className={styles.navItem}>
                <button
                  onClick={() => scrollToSection('WhyJoin')}
                  className={styles.navLink}
                >
                  Manfaat
                </button>
              </li>
              <li className={styles.navItem}>
                <button onClick={() => scrollToSection('Timeline')} className={styles.navLink}>Timeline</button>
              </li>
              <li className={styles.navItem}>
                <button
                  onClick={() => scrollToSection('Faq')}
                  className={styles.navLink}
                >
                  FAQ
                </button>
              </li>
            </>
          )}
        </ul>
        <Link to="/register" className={styles.navLinkButton}>
          DAFTAR TIM
        </Link>
			</nav>
		</div>
  );
};

export default Navbar;