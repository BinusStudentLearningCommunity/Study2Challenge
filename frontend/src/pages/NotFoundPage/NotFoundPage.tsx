import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.subtitle}>Page Not Found</p>
                <p className={styles.description}>
                    The page you are looking for might have been moved, deleted, or never existed.
                </p>
                <Link to="/" className={styles.homeButton}>
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;