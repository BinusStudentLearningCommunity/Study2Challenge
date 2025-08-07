import styles from './Footer.module.css';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to allow navigation to complete
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>Logo "STUDY 2 CHALLENGE 2025"</div>
          <p className={styles.footerDesc}>
            <em>
                STUDY 2 CHALLENGE 2025 adalah kompetisi hackathon tingkat nasional dari BINUS Student Learning Community (BSLC) yang menjadi wadah bagi siswa dan mahasiswa seluruh Indonesia untuk berinovasi.
            </em>
          </p>
          <div className={styles.footerSocials}>
            <a href="https://www.instagram.com/study2challenge/" target="_blank" aria-label="Instagram"><span className={styles.socialIcon}><img src="/assets/Group 30.png" alt="" /></span></a>
            <a href="#" target="_blank" aria-label="Facebook"><span className={styles.socialIcon}><img src="/assets/Group 32.png" alt="" /></span></a>
            <a href="#" target="_blank" aria-label="Link"><span className={styles.socialIcon}><img src="/assets/facebook.png" alt="" /></span></a>
          </div>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>USER</div>
            <a href="/register">Register</a>
            <a href="/login">Login</a>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>SITE MAP</div>
            <button onClick={() => scrollToSection('Hero')} className={styles.footerLinkButton}>Tentang S2C</button>
            <button onClick={() => scrollToSection('WhyJoin')} className={styles.footerLinkButton}>Manfaat</button>
            <button onClick={() => scrollToSection('Timeline')} className={styles.footerLinkButton}>Timeline</button>
            <button onClick={() => scrollToSection('Faq')} className={styles.footerLinkButton}>FAQ</button>
          </div>
        </div>
      </div>
      <div className={styles.footerCopyright}>
        Copyright © 2025 BINUS Student Learning Community.
      </div>
    </footer>
  );
};

export default Footer;
