import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { motion } from 'framer-motion';

import DashboardNavbar from '../../components/layout/DashboardNavbar/DashboardNavbar.tsx';
import TimelineItem from '../../components/Timeline/TimelineItem.tsx';
import TeamBox from '../../components/Team/TeamBox.tsx';

import Person from '../../../public/assets/dashboard/person.svg?react';
import Document from '../../../public/assets/dashboard/document.svg?react';
import Selection from '../../../public/assets/dashboard/selection.svg?react'
import Communication from '../../../public/assets/dashboard/communication.svg?react';
import Headphone from '../../../public/assets/dashboard/headphone.svg?react';
import Laptop from '../../../public/assets/dashboard/laptop.svg?react';
import Medal from '../../../public/assets/dashboard/medal.svg?react';

import styles from './ParticipantDashboardPage.module.css';

interface DashboardData {
  message: string;
  // masih template schema random
}

const ParticipantDashboardPage: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [hasTeam, /*setHasTeam*/] = useState(false); // true dan false pengaruh ke TeamBox yang ditampilkan
    const [joinTeam, setJoinTeam] = useState(false); // popup
    const [isPassed, /*setIsPassed*/] = useState(true); // Untuk mengubah rendering TeamBox dan TimelineItem

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get<DashboardData>('/dashboard');
                setMessage(response.data.message);
            } catch (err: unknown) {
                setError('Failed to fetch dashboard data. Please log in again.');
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleJoinTeam = () => {
        setJoinTeam(!joinTeam);
    }

    const hoverEffect = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    return (
        <>
            <DashboardNavbar/>
            <div>
                <img src="/assets/galaxy-orbit-2.png" alt="Yellow Galaxy" className={styles.yellowGalaxy} />
                <img src="/assets/astronautFall_blue 1.png" alt="Blue Astronaut" className={styles.blueAstronaut} />
                <img src="/assets/Clip path group 4.png" alt="Yellow Clip Path" className={styles.yellowClipPath}/>
                <img src="/assets/Clip path group 3.png" alt="Blue Clip Path" className={styles.blueClipPath} />
            </div>
            <div className={styles.dashboardContainer}>
                <div className={styles.greetingsContainer}>
                    <h1 className={styles.greetings}>Selamat Datang, [Nama User]!</h1>
                </div>

                {/* This block handles API messages and silences the build error. */}
                {error && <p className={styles.errorText}>{error}</p>}
                {message && <div style={{ display: 'none' }}>{message}</div>}

                { hasTeam ? (
                    <div className={styles.teamContainer}>
                    <TeamBox
                        backgroundColor={{backgroundColor: '#D9D9D90D', filter: 'blur(94.92)'}}
                        title='Nama Tim:'
                        titleColor={{color: '#FFC673'}}
                        buttonText={'[Nama Tim Anda]'}
                        buttonFunction={() => {}}
                        buttonColor={{color: '#6C4F26', background: 'radial-gradient(#FFBE61, #C48F43)', filter: 'drop-shadow(0 0 18px #C48F43)'}}
                    />
                    <TeamBox
                        backgroundColor={{backgroundColor: '#D9D9D90D', filter: 'blur(94.92)'}}
                        title='Pembayaran:'
                        titleColor={{color: '#98FF61'}}
                        buttonText={'Lunas'}
                        buttonFunction={() => {}}                    
                        buttonColor={{color: '#387318', background: 'radial-gradient(#70C443, #98FF61)', filter: 'drop-shadow(0 0 18px #98FF61)'}}
                    />
                    <TeamBox
                        backgroundColor={{backgroundColor: '#D9D9D90D', filter: 'blur(94.92)'}}
                        title='Kualifikasi:'
                        titleColor={{color: '#98FF61'}}
                        buttonText={'Lolos ke Tahap Implementasi'}
                        buttonFunction={() => {}}
                        buttonColor={{color: '#387318', background: 'radial-gradient(#70C443, #98FF61)', filter: 'drop-shadow(0 0 18px #98FF61)'}}
                    />
                    <TeamBox
                        backgroundColor={{backgroundColor: '#D9D9D90D', filter: 'blur(94.92)'}}
                        title='Generate Kode Tim:'
                        titleColor={{color: '#FFC673'}}
                        buttonText={'#########'}
                        buttonFunction={() => {}}
                        buttonColor={{color: '#6C4F26', background: 'radial-gradient(#FFBE61, #C48F43)', filter: 'drop-shadow(0 0 18px #C48F43)'}}
                    />
                    </div>
                ) : (
                    <div className={styles.teamContainer}>
                        <TeamBox
                            backgroundColor={{backgroundColor: '#D9D9D90D'}}
                            title='Klik Dibawah untuk Membuat Tim:'
                            titleColor={{color: '#FFC673'}}
                            buttonText={'Create Team'}
                            buttonFunction={() => {}}
                            buttonColor={{color: '#6C4F26', background: 'radial-gradient(#FFBE61, #C48F43)', filter: 'drop-shadow(0 0 18px #C48F43)'}}
                        />
                        <TeamBox
                            backgroundColor={{backgroundColor: '#D9D9D90D'}}
                            title='Mencari Tim? Mulai Disini.'
                            titleColor={{color: '#3F86FF'}}
                            buttonText={'Join Team'}
                            buttonFunction={handleJoinTeam}
                            buttonColor={{color: '#A2C5FF', background: 'radial-gradient(#0B3D91, #155DD7)', filter: 'drop-shadow(0 0 18px #155DD7)'}}
                        />
                        {joinTeam && 
                            <div className={styles.joinTeamPopupContainer}>
                                <div className={styles.joinTeamPopup}>
                                    <h4 className={styles.popupHeader}>Please enter the code to access your team.</h4>
                                    <div className={styles.popupFieldContainer}>
                                        <p>Invitation Code</p>
                                        <input type="text" placeholder='Enter Your Team Code..'/>
                                    </div>
                                    <div className={styles.popupButtonContainer}>
                                        <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                                            <button className={styles.cancelButton} onClick={handleJoinTeam}>Cancel</button>
                                        </motion.div>
                                        <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                                            <button className={styles.joinButton}>Join</button>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                )}
                <section className={styles.timelineContainer}>
                    <div>
                        <h2 className={`${styles.timelineHeader} ${styles.blueFont}`}>S2C Timeline Acara</h2>
                        <p className={`${styles.timelineSubheader} ${styles.cyanFont}`}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam augue erat, placerat at justo nec, ultrices suscipit massa.
                        </p>
                    </div>
                    <div className={styles.timelineItemContainer}>
                        <TimelineItem 
                            icon={<Person/>}
                            title='Pendaftaran Tim' 
                            subtitle='Selesai / Link ke event registration page' 
                            date='25 Agustus – 21 September 2025' 
                            active={true}
                        />
                        <TimelineItem
                            icon={<Document/>} 
                            title='Pengumpulan Proposal' 
                            subtitle='Selesai / Link Google Form Pengumpulan' 
                            date='21 September 2025' 
                            active={true}
                        />
                        <TimelineItem
                            icon={<Selection/>} 
                            title='Seleksi' 
                            subtitle='Sedang Berlangsung' 
                            date='25 Agustus – 21 September 2025' 
                            active={true}
                        />
                        { isPassed ? (
                            <>
                                <TimelineItem
                                    icon={<Communication/>} 
                                    title='Pengumuman Lolos' 
                                    subtitle='Selamat, tim Anda lolos!' 
                                    date='27 September 2025' 
                                    active={false}
                                />            
                                <TimelineItem
                                    icon={<Headphone/>} 
                                    title='Technical Meeting' 
                                    subtitle='<Zoom Meeting Link>' 
                                    date='28 September 2025' 
                                    active={false}
                                />
                                <TimelineItem
                                    icon={<Laptop/>} 
                                    title='Tahap Implementasi / Coding' 
                                    subtitle='Sedang Berlangsung / Link Google Form Pengumpulan' 
                                    date='29 September – 12 Oktober 2025' 
                                    active={false}
                                />
                                <TimelineItem
                                    icon={<Medal/>} 
                                    title='Pengumuman Pemenang' 
                                    subtitle='Akan Datang' 
                                    date='19 Oktober 2025' 
                                    active={false}
                                />
                            </>   
                        ) : (
                            <TimelineItem
                                icon={<Communication/>}  
                                title='Pengumuman Lolos' 
                                subtitle='Mohon maaf, tim Anda belum lolos.' 
                                date='27 September 2025' 
                                active={false}
                            />      
                        )
                    }
                    </div>
                </section>              
            </div>
        </>
    );
};

export default ParticipantDashboardPage;