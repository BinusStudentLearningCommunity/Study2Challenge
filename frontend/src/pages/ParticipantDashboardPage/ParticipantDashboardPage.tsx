import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

import DashboardNavbar from '../../components/layout/DashboardNavbar/DashboardNavbar.tsx';
import TimelineItem from '../../components/Timeline/TimelineItem.tsx';
import TeamBox from '../../components/Team/TeamBox.tsx';
import { useNavigate } from 'react-router-dom';

import Person from '../../../public/assets/dashboard/person.svg?react';
import Document from '../../../public/assets/dashboard/document.svg?react';
import Selection from '../../../public/assets/dashboard/selection.svg?react'
import Communication from '../../../public/assets/dashboard/communication.svg?react';
import Headphone from '../../../public/assets/dashboard/headphone.svg?react';
import Laptop from '../../../public/assets/dashboard/laptop.svg?react';
import Medal from '../../../public/assets/dashboard/medal.svg?react';

import { getMyTeam, joinTeamByCode } from '../../features/event/eventService';
import type { MyTeamResponse } from '../../features/event/eventService';

import styles from './ParticipantDashboardPage.module.css';


interface DashboardData {
  message: string;
  // masih template schema random
}

const isActiveDate = (dateStr: string): boolean => {
  const monthMap: { [key: string]: number } = {
    'agustus': 7,
    'september': 8,
    'oktober': 9,
  };

  const today = new Date();
//   const today = new Date(2025, 7, 25); // testing purposes, set to 25 August 2025

  today.setHours(0, 0, 0, 0);

  const startDateStr = dateStr.split(' – ')[0];
  const year = parseInt(dateStr.match(/\d{4}/)![0], 10);

  const [day, monthName] = startDateStr.trim().split(' ');
  const month = monthMap[monthName.toLowerCase()];
  
  const eventStartDate = new Date(year, month, parseInt(day));

  return today >= eventStartDate;
};

const ParticipantDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [joinTeam, setJoinTeam] = useState(false); // popup
    const [isPassed, setIsPassed] = useState(false);
    const navigate = useNavigate();

    const [teamData, setTeamData] = useState<MyTeamResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [teamCodeInput, setTeamCodeInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [isRegistrationClosed, setIsRegistrationClosed] = useState(false); // di set jadi 22 sept jam 9 pagi, after this, user yang belum join team gak ke display dashboard
    const [hasAnnouncementTimePassed, setHasAnnouncementTimePassed] = useState(false); // di set jadi 27 sept jam 12 siang, before this, semua ke display (Proses Seleksi), setelah itu baru ke display lolos atau tidak lolos

    useEffect(() => {
        const checkDeadlines = () => {
            const now = new Date();
            // Registration deadline check (existing)
            const registrationDeadline = new Date('2025-09-22T09:00:00'); // Sept 22, 9:00 AM
            if (now > registrationDeadline) {
                setIsRegistrationClosed(true);
            }

            // Qualification announcement deadline
            const announcementDeadline = new Date('2025-09-27T12:00:00'); // Sept 27, 12:00 PM
            if (now > announcementDeadline) {
                setHasAnnouncementTimePassed(true);
            }
        };
        checkDeadlines();
    }, []);

   useEffect(() => {
        const fetchPageData = async () => {
            setIsLoading(true);
            try {
                const dashboardResponse = await apiClient.get<DashboardData>('/dashboard');
                setMessage(dashboardResponse.data.message);

                const teamResponse = await getMyTeam();
                setTeamData(teamResponse);

                setIsPassed(teamResponse.team.isQualified);
            } catch (err) {
                console.error("Error fetching page data:", err);
                setTeamData(null);
                setIsPassed(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPageData();
    }, []);

    const handleJoinTeam = () => {
        setJoinTeam(!joinTeam);
    }

    const handleJoinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamCodeInput) {
            toast.error("Please enter a team code.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await joinTeamByCode(teamCodeInput) as { message?: string };
            toast.success(response.message || "Successfully joined team!");
            setJoinTeam(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: unknown) {
            let errorMessage = "An unexpected error occurred.";
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const response = (error as { response?: { data?: { message?: string } } }).response;
                if (response?.data?.message) {
                    errorMessage = response.data.message;
                }
            }
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            toast.success('Team code copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy code: ', err);
            toast.error('Failed to copy code.');
        });
    };

    const hoverEffect = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    if (isLoading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <>
            <Toaster position="bottom-right" />
            <DashboardNavbar/>
            <div>
                <img src="/assets/galaxy-orbit-2.png" alt="Yellow Galaxy" className={styles.yellowGalaxy} />
                <img src="/assets/astronautFall_blue 1.png" alt="Blue Astronaut" className={styles.blueAstronaut} />
                <img src="/assets/Clip path group 4.png" alt="Yellow Clip Path" className={styles.yellowClipPath}/>
                <img src="/assets/Clip path group 3.png" alt="Blue Clip Path" className={styles.blueClipPath} />
            </div>
            <div className={styles.dashboardContainer}>
                <div className={styles.greetingsContainer}>
                    <h1 className={styles.greetings}>Selamat Datang, {user?.name || 'Guest'}!</h1>
                </div>

                {message && <div style={{ display: 'none' }}>{message}</div>}
                
                {isRegistrationClosed && !teamData ? (
                    <div className={styles.registrationClosedContainer}>
                        <h2>Mohon Maaf, Pendaftaran Telah Ditutup</h2>
                        <p>Pendaftaran untuk STUDY 2 CHALLENGE 2025 telah berakhir pada 22 September 2025.</p>
                    </div>
                ) : (
                    <>
                        { teamData ? (
                            <div className={styles.teamContainer}>
                                <TeamBox
                                    backgroundColor={{backgroundColor: '#D9D9D90D', filter: 'blur(94.92)'}}
                                    title='Nama Tim:'
                                    titleColor={{color: '#FFC673'}}
                                    buttonText={teamData.team.teamName}
                                    buttonFunction={() => {}}
                                    buttonColor={{color: '#6C4F26', background: 'radial-gradient(#FFBE61, #C48F43)', filter: 'drop-shadow(0 0 18px #C48F43)'}}
                                />
                                <TeamBox
                                    backgroundColor={{backgroundColor: '#D9D9D90D', filter: 'blur(94.92)'}}
                                    title='Pembayaran:'
                                    titleColor={teamData.team.isPay ? {color: '#98FF61'} : {color: '#FFC673'}}
                                    buttonText={teamData.team.isPay ? 'Lunas' : 'Menunggu Verifikasi'}
                                    buttonFunction={() => {}}
                                    buttonColor={teamData.team.isPay
                                        ? {color: '#387318', background: 'radial-gradient(#70C443, #98FF61)', filter: 'drop-shadow(0 0 18px #98FF61)'}
                                        : {color: '#6C4F26', background: 'radial-gradient(#FFBE61, #C48F43)', filter: 'drop-shadow(0 0 18px #C48F43)'}}
                                />
                                <TeamBox
                                    backgroundColor={{backgroundColor: '#D9D9D90D', filter: 'blur(94.92)'}}
                                    title='Kualifikasi:'
                                    titleColor={!hasAnnouncementTimePassed ? {color: '#FFC673'} : (teamData.team.isQualified ? {color: '#98FF61'} : {color: '#FF6161'})}
                                    buttonText={!hasAnnouncementTimePassed ? 'Proses Seleksi' : (teamData.team.isQualified ? 'Lolos' : 'Tidak Lolos')}
                                    buttonFunction={() => {}}
                                    buttonColor={!hasAnnouncementTimePassed
                                        ? {color: '#6C4F26', background: 'radial-gradient(#FFBE61, #C48F43)', filter: 'drop-shadow(0 0 18px #C48F43)'}
                                        : (teamData.team.isQualified
                                            ? {color: '#387318', background: 'radial-gradient(#70C443, #98FF61)', filter: 'drop-shadow(0 0 18px #98FF61)'}
                                            : {color: '#731818', background: 'radial-gradient(#C44343, #FF6161)', filter: 'drop-shadow(0 0 18px #FF6161)'})}
                                />
                                <TeamBox
                                    backgroundColor={{backgroundColor: '#D9D9D90D', filter: 'blur(94.92)'}}
                                    title='Kode Tim:'
                                    titleColor={{color: '#FFC673'}}
                                    buttonText={teamData.team.teamCode}
                                    buttonFunction={() => handleCopyToClipboard(teamData.team.teamCode)}
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
                                    buttonFunction={() => navigate('/event-registration')}
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
                                        <form className={styles.joinTeamPopup} onSubmit={handleJoinSubmit}>
                                            <h4 className={styles.popupHeader}>Please enter the code to access your team.</h4>
                                            <div className={styles.popupFieldContainer}>
                                                <p>Invitation Code</p>
                                                <input
                                                    type="text"
                                                    placeholder='Enter Your Team Code..'
                                                    value={teamCodeInput}
                                                    onChange={(e) => setTeamCodeInput(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className={styles.popupButtonContainer}>
                                                <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                                                    <button type="button" className={styles.cancelButton} onClick={handleJoinTeam}>Cancel</button>
                                                </motion.div>
                                                <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                                                    <button type="submit" className={styles.joinButton} disabled={isSubmitting}>
                                                        {isSubmitting ? 'Joining...' : 'Join'}
                                                    </button>
                                                </motion.div>
                                            </div>
                                        </form>
                                    </div>
                                }
                            </div>
                        )}
                        <section className={styles.timelineContainer}>
                            <div>
                                <h2 className={`${styles.timelineHeader} ${styles.blueFont}`}>S2C Timeline Acara</h2>
                                <p className={`${styles.timelineSubheader} ${styles.cyanFont}`}>
                                    Berikut adalah timeline STUDY 2 CHALLENGE 2025. Status setiap tahapan acara dapat dilihat pada timeline di bawah ini.
                                </p>
                            </div>
                            <div className={styles.timelineItemContainer}>
                                <TimelineItem 
                                    icon={<Person/>}
                                    title='Pendaftaran Tim' 
                                    subtitle='Pengisian form pendaftaran tim dan profil anggota.' 
                                    date='25 Agustus – 21 September 2025' 
                                    active={isActiveDate('25 Agustus – 21 September 2025')}
                                />
                                <TimelineItem
                                    icon={<Document/>} 
                                    title='Pengumpulan Proposal' 
                                    subtitle='Pengumpulan proposal ide aplikasi.' 
                                    date='25 Agustus – 21 September 2025' 
                                    active={isActiveDate('25 Agustus – 21 September 2025')}
                                />
                                <TimelineItem
                                    icon={<Selection/>} 
                                    title='Seleksi' 
                                    subtitle='Proses penilaian proposal oleh juri.' 
                                    date='22 September – 26 September 2025' 
                                    active={isActiveDate('22 September – 26 September 2025')}
                                />
                                { isPassed ? (
                                    <>
                                        <TimelineItem
                                            icon={<Communication/>} 
                                            title='Pengumuman Lolos' 
                                            subtitle='Pengumuman hasil seleksi proposal.' 
                                            date='27 September 2025' 
                                            active={isActiveDate('27 September 2025')}
                                        />            
                                        <TimelineItem
                                            icon={<Headphone/>} 
                                            title='Technical Meeting' 
                                            subtitle='Penjelasan teknis untuk tahap implementasi.' 
                                            date='28 September 2025' 
                                            active={isActiveDate('28 September 2025')}
                                        />
                                        <TimelineItem
                                            icon={<Laptop/>} 
                                            title='Tahap Implementasi / Coding' 
                                            subtitle='Pengembangan aplikasi berbasis website.' 
                                            date='29 September – 12 Oktober 2025' 
                                            active={isActiveDate('29 September – 12 Oktober 2025')}
                                        />
                                        <TimelineItem
                                            icon={<Medal/>} 
                                            title='Pengumuman pemenang kompetisi.' 
                                            subtitle='Akan Datang' 
                                            date='19 Oktober 2025' 
                                            active={isActiveDate('19 Oktober 2025')}
                                        />
                                    </>   
                                ) : (
                                    <TimelineItem
                                        icon={<Communication/>}  
                                        title='Pengumuman Lolos' 
                                        subtitle='Mohon maaf, tim Anda belum lolos.' 
                                        date='27 September 2025' 
                                        active={isActiveDate('27 September 2025')}
                                    />      
                                )
                            }
                            </div>
                        </section>
                    </>
                )}
            </div>
        </>
    );
};

export default ParticipantDashboardPage;