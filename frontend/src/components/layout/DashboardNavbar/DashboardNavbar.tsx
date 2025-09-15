import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import Logo from "../../../../public/assets/Study2Challenge-logo-dark.png";

import { FaUser } from "react-icons/fa";
import { MdDashboard, MdMenuBook, MdLogout } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { TbFileReport } from "react-icons/tb";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import styles from "./DashboardNavbar.module.css";

const DashboardNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isSelected = (path: string) =>
    location.pathname === path ? styles.active : "";

  return (
    <>
      <button
        className={styles.menuToggle}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>
      <div
        className={`${styles.dashboardNavbarContainer} ${
          isMenuOpen ? styles.open : styles.closed
        }`}
      >
        <nav className={styles.dashboardNavbar}>
          <div className={styles.logoWrapper}>
            <img
              src={Logo}
              alt="Study2Challenge Logo"
              className={styles.logo}
            />
          </div>
          <div className={styles.menuContainer}>
            <ul className={styles.menu}>
              <Link
                to="/profile"
                className={`${styles.menuItem} ${isSelected("/profile")}`}
              >
                <FaUser
                  className={`${styles.icon} ${isSelected("/profile")}`}
                />
                Profile
              </Link>
              {user?.email !== "s2cadmin@gmail.com" && (
                <>
                  <Link
                    to="/team"
                    className={`${styles.menuItem} ${isSelected("/team")}`}
                  >
                    <HiUserGroup
                      className={`${styles.icon} ${isSelected("/team")}`}
                    />
                    Team
                  </Link>
                  <Link
                    to="/proposal"
                    className={`${styles.menuItem} ${isSelected("/proposal")}`}
                  >
                    <TbFileReport
                      className={`${styles.icon} ${isSelected("/proposal")}`}
                    />
                    Proposal
                  </Link>
                </>
              )}
              <Link
                to={
                  user?.email === "s2cadmin@gmail.com" ? "/admin" : "/dashboard"
                }
                className={`${styles.menuItem} ${isSelected(
                  user?.email === "s2cadmin@gmail.com" ? "/admin" : "/dashboard"
                )}`}
              >
                <MdDashboard
                  className={`${styles.icon} ${isSelected(
                    user?.email === "s2cadmin@gmail.com"
                      ? "/admin"
                      : "/dashboard"
                  )}`}
                />
                Dashboard
              </Link>
              <a
                href="https://bit.ly/GuidebookS2C2025"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
              >
                <MdMenuBook className={styles.icon} />
                Guidebook
              </a>
              <div className={`${styles.menuItem}`} onClick={handleLogout}>
                <MdLogout className={styles.icon} />
                Log Out
              </div>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default DashboardNavbar;
