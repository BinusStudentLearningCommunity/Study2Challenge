import type React from 'react';
import styles from './TeamBox.module.css';

import { motion } from 'framer-motion';

interface TeamBoxprops {
    backgroundColor: React.CSSProperties,
    title: string,
    titleColor: React.CSSProperties,
    buttonText: string,
    buttonFunction: (event: React.MouseEvent<HTMLButtonElement>) => void,
    buttonColor: React.CSSProperties
}

const hoverEffect = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
};

const TeamBox = ({backgroundColor, title, titleColor, buttonText, buttonFunction, buttonColor}: TeamBoxprops) => {
    return(
        <div className={styles.teamName} style={backgroundColor}>
            <h1 className={styles.teamTitle} style={titleColor}>{title}</h1>
            <motion.div variants={{ ...hoverEffect}} whileHover="hover" whileTap="tap">
                <button className={styles.teamButton} style={buttonColor} onClick={buttonFunction}>{buttonText}</button>
            </motion.div>
        </div>
    )
}

export default TeamBox;