import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { toast, Toaster } from 'react-hot-toast';
import DashboardNavbar from "../../components/layout/DashboardNavbar/DashboardNavbar.tsx";
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
    const [editProfile, setEditProfile] = useState(false); // popup
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user, editProfile]);

    const handleEditProfile = () => {
        setEditProfile(!editProfile);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name === user?.name && formData.email === user?.email) {
            toast.error("No changes were made.");
            setEditProfile(false);
            return;
        }
        setIsSubmitting(true);
        try {
            await updateUser(formData);
            toast.success("Profile updated successfully!");
            setEditProfile(false);
        } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number; data?: { message?: string } } };

            if (axiosError.response?.status === 409) {
                toast.error(axiosError.response.data?.message || 'This email is already taken.');
            } else {
                toast.error("Failed to update profile. Please try again.");
            }
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const hoverEffect = {
        hover: { scale: 1.03 },
        tap: { scale: 0.95 }
    };

    return(
        <>
            <Toaster position="bottom-right" />
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
                         <p>{user?.name || "Loading..."}</p>
                    </div>
                    <div className={styles.userDataField}>
                        <h3>Email</h3>
                        <p>{user?.email || "Loading..."}</p>
                    </div>
                    <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                        <button className={styles.editButton} onClick={handleEditProfile}>Edit</button>                    
                    </motion.div>                    

                    {editProfile &&
                        <div className={styles.editProfilePopupContainer}>
                            <form onSubmit={handleSubmit} className={styles.editProfilePopup}>
                                <h4 className={styles.popupHeader}>Personal Information</h4>
                                <div className={styles.popupFieldContainer}>
                                    <p>Full Name</p>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder='Enter Your Full Name..'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.popupFieldContainer}>
                                    <p>Email</p>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder='Enter Your Email..'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.popupButtonContainer}>
                                    <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                                        <button type="button" className={styles.cancelButton} onClick={handleEditProfile}>Cancel</button>
                                    </motion.div>
                                    <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                                        <button type="submit" className={styles.joinButton} disabled={isSubmitting}>
                                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </motion.div>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default ProfilePage;