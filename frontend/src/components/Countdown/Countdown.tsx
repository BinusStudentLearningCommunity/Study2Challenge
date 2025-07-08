import { useEffect, useState } from 'react';
import styles from './Countdown.module.css';

const Countdown = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    function getTimeLeft() {
        const now = new Date();
        const diff = new Date(targetDate).getTime() - now.getTime();

        const seconds = Math.max(Math.floor(diff / 1000) % 60, 0);
        const minutes = Math.max(Math.floor(diff / 1000 / 60) % 60, 0);
        const hours = Math.max(Math.floor(diff / 1000 / 60 / 60) % 24, 0);
        const days = Math.max(Math.floor(diff / 1000 / 60 / 60 / 24), 0);

        return { days, hours, minutes, seconds };
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.countdown}>
            {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className={styles.time}>
                    <span className={styles.number}>{value}</span>
                    <span className={styles.label}>{label.toUpperCase()}</span>
                </div>
            ))}
        </div>
    );
};

export default Countdown;
