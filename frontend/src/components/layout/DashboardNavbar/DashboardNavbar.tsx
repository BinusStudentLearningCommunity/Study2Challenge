import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import Logo from '../../../../public/assets/Study2Challenge-logo-dark.png';

import Person from '../../../../public/assets/dashboard/person.svg?react';
import Dashboard from '../../../../public/assets/dashboard/dashboard.svg?react';
import MenuBook from '../../../../public/assets/dashboard/guideline.svg?react';
// import Application from '../../../../public/assets/dashboard/settings_applications.svg?react';
import Logout from '../../../../public/assets/dashboard/exit_to_app.svg?react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

import styles from './DashboardNavbar.module.css';

const DashboardNavbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isSelected = (path: string) => location.pathname === path ? styles.active : '';

    return(
        <>
            <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                ☰
            </button>
            <div className={`${styles.dashboardNavbarContainer} ${isMenuOpen ? styles.open : styles.closed}`}>
                <nav className={styles.dashboardNavbar}>
                    <div className={styles.logoWrapper}>
                        <img src={Logo} alt="Study2Challenge Logo" className={styles.logo}/>
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
                            <a href="https://bit.ly/GuidebookS2C2025" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
                                <MenuBook className={styles.icon}/> 
                                Guidebook
                            </a>
                            {/* <Link to='/event-registration' className={`${styles.menuItem} ${isSelected('/app')}`}>
                                <Application className={`${styles.icon} ${isSelected('/app')}`}/>                          
                                Aplikasi
                            </Link> */}
                            <div className={`${styles.menuItem}`} onClick={handleLogout}>
                                <Logout className={styles.icon} />
                                Log Out
                            </div>
                        </ul>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default DashboardNavbar;