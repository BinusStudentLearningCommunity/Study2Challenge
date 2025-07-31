import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import Person from '../../../../public/assets/dashboard/person.svg?react';
import Dashboard from '../../../../public/assets/dashboard/dashboard.svg?react';
import Application from '../../../../public/assets/dashboard/settings_applications.svg?react';
import Logout from '../../../../public/assets/dashboard/exit_to_app.svg?react';

import styles from './DashboardNavbar.module.css';

const DashboardNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isSelected = (path: String) => location.pathname === path ? styles.active : '';

    return(
        <>
            <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                ☰
            </button>
            <div className={`${styles.dashboardNavbarContainer} ${isMenuOpen ? styles.open : styles.closed}`}>
                <nav className={styles.dashboardNavbar}>
                    <div className={styles.logo}>
                        <h1>Logo Study2Challenge 2025</h1>
                    </div>
                    <div className={styles.menuContainer}>
                        <ul className={styles.menu}>
                            <Link to='/profile' className={`${styles.menuItem} ${isSelected('/profile')}`}>
                                <Person className={`${styles.icon} ${isSelected('/profile')}`}/>
                                Profile
                            </Link>
                            <Link to='/dashboard' className={`${styles.menuItem} ${isSelected('/dashboard')}`}>
                                <Dashboard className={`${styles.icon} ${isSelected('/dashboard')}`}/>            
                                Dashboard
                            </Link>
                            <Link to='/app' className={`${styles.menuItem} ${isSelected('/app')}`}>
                                <Application className={`${styles.icon} ${isSelected('/app')}`}/>                          
                                Aplikasi
                            </Link>
                            <Link to='/' className={`${styles.menuItem} ${isSelected('/')}`}>
                                <Logout className={`${styles.icon} ${isSelected('/')}`}/>     
                                Log Out
                            </Link>
                        </ul>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default DashboardNavbar;