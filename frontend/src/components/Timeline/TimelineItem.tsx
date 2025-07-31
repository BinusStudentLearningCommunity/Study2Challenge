import type { ReactNode } from 'react';

import styles from './TimelineItem.module.css';

interface TimelineItemProps {
    icon: ReactNode,
    title: string;
    subtitle: string;
    date: string;
    active: boolean;
}

const TimelineItem = ({ icon, title, subtitle, date, active }: TimelineItemProps) => {
    return (
        <div className={`${styles.timelineItem} ${active ? styles.active : ''}`}>
            <div className={`${styles.timelineDot} ${active ? styles.activeDot : ''}`}>
                <div className={`${styles.dotAsset} ${active ? styles.activeDotAsset : ''}`}>
                    {icon}
                </div>
            </div>
            <h3 className={`${styles.timelineTitle} ${active ? styles.activeTitle : styles.title}`}>{title}</h3>
            <p className={`${styles.timelineSubtitle} ${active ? styles.activeSubtitle : styles.subtitle}`}>{subtitle}</p>
            <p className={`${styles.timelineDate} ${active ? styles.activeDate : styles.date}`}>{date}</p>
        </div>
    );
};

export default TimelineItem;