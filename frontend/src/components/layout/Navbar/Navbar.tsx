import { Link } from 'react-router-dom';
import styles from './Navbar.module.css'; 

// HANYA CODE CONTOH
const Navbar = () => {
  // TODO: Nanti kita akan tambahkan logika untuk menampilkan link berdasarkan status login dari AuthContext
  const isLoggedIn = false; // Placeholder, ganti dengan status dari AuthContext

  return (
		<div className={styles.navbarContainer}>
			<nav className={styles.navbar}>
				<div className={styles.navbarBrand}>
					<Link to="/" className={styles.brandLink}>
						Logo "STUDY 2 CHALLENGE 2025"
					</Link>
				</div>
				<ul className={styles.navbarNav}>
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
									Tentang S2C
								</Link>
							</li>
							<li className={styles.navItem}>
								<Link to="/register" className={styles.navLink}>
									Manfaat
								</Link>
							</li>
							<li className={styles.navItem}>
								<Link to="/register" className={styles.navLink}>
									Timeline
								</Link>
							</li>
							<li className={styles.navItem}>
								<Link to="/register" className={styles.navLink}>
									FAQ
								</Link>
							</li>
						</>
					)}
				</ul>
				<Link to="/event-registration" className={styles.navLinkButton}>
					DAFTAR TIM
				</Link>
			</nav>
		</div>
  );
};

export default Navbar;