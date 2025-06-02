import { Link } from 'react-router-dom';
import styles from './Navbar.module.css'; 

// HANYA CODE CONTOH
const Navbar = () => {
  // TODO: Nanti kita akan tambahkan logika untuk menampilkan link berdasarkan status login dari AuthContext
  const isLoggedIn = false; // Placeholder, ganti dengan status dari AuthContext

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <Link to="/" className={styles.brandLink}>
          EventApp
        </Link>
      </div>
      <ul className={styles.navbarNav}>
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className={styles.navItem}>
              <Link to="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
            </li>
            <li className={styles.navItem}>
              {/* TODO: Tambahkan fungsi logout */}
              <button className={styles.navLinkButton}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className={styles.navItem}>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/register" className={styles.navLink}>
                Register
              </Link>
            </li>
          </>
        )}
         <li className={styles.navItem}>
          <Link to="/event-registration" className={styles.navLink}>
            Daftar Event
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;