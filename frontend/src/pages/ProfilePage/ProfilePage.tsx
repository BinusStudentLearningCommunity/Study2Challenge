import { useState } from "react";
import { motion } from "framer-motion";

import DashboardNavbar from "../../components/layout/DashboardNavbar/DashboardNavbar.tsx";

import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
    const [editProfile, setEditProfile] = useState(false); // popup

    const handleEditProfile = () => {
        setEditProfile(!editProfile);
    }

    const hoverEffect = {
        hover: { scale: 1.03 },
        tap: { scale: 0.95 }
    };

    return(
        <>
            <DashboardNavbar/>        
            <div>
                <img src="/assets/galaxy-orbit-2.png" alt="Yellow Galaxy" className={styles.yellowGalaxy} />
                <img src="/assets/astronautFall_blue 1.png" alt="Blue Astronaut" className={styles.blueAstronaut} />
                <img src="/assets/Clip path group 4.png" alt="Yellow Clip Path" className={styles.yellowClipPath}/>
                <img src="/assets/Clip path group 3.png" alt="Blue Clip Path" className={styles.blueClipPath} />
            </div>
            <div className={styles.profileContainer}>
                <div className={styles.titleContainer}>
                    <h1>USER</h1>
                </div>
                <div className={styles.userDataContainer}>
                    <h2>Personal Information</h2>
                    <div className={styles.userDataField}>
                        <h3>Full Name</h3>
                        <p>"Your Full Name"</p>
                    </div>
                    <div className={styles.userDataField}>
                        <h3>Email</h3>
                        <p>"emailaddress@gmail.com"</p>
                    </div>
                    <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                        <button className={styles.editButton} onClick={handleEditProfile}>Edit</button>                    
                    </motion.div>                    

                    {editProfile &&
                        <div className={styles.editProfilePopupContainer}>
                            <div className={styles.editProfilePopup}>
                                <h4 className={styles.popupHeader}>Personal Information</h4>
                                <div className={styles.popupFieldContainer}>
                                    <p>Full Name</p>
                                    <input type="text" placeholder='Enter Your Full Name..'/>
                                </div>
                                <div className={styles.popupFieldContainer}>
                                    <p>Email</p>
                                    <input type="text" placeholder='Enter Your Email..'/>
                                </div>
                                <div className={styles.popupButtonContainer}>
                                    <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                                        <button className={styles.cancelButton} onClick={handleEditProfile}>Cancel</button>
                                    </motion.div>
                                    <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                                        <button className={styles.joinButton}>Join</button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default ProfilePage;