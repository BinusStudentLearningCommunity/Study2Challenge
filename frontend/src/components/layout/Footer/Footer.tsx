import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>Logo "STUDY 2 CHALLENGE 2025"</div>
          <p className={styles.footerDesc}>
            <em>
                STUDY 2 CHALLENGE 2025 adalah kompetisi hackathon tingkat nasional dari BINUS Student Learning Community (BSLC) yang menjadi wadah bagi mahasiswa seluruh Indonesia untuk berinovasi. Mengusung tema "Bridging Global Problems: Tech for a Better Tomorrow", kompetisi ini menantang peserta untuk menciptakan solusi teknologi berbasis website yang berdampak nyata pada isu-isu global, khususnya yang berkaitan dengan SDGs 1-4.
            </em>
          </p>
          <div className={styles.footerSocials}>
            <a href="#" aria-label="Instagram"><span className={styles.socialIcon}><img src="/assets/Group 30.png" alt="" /></span></a>
            <a href="#" aria-label="Facebook"><span className={styles.socialIcon}><img src="/assets/Group 32.png" alt="" /></span></a>
            <a href="#" aria-label="Link"><span className={styles.socialIcon}><img src="/assets/facebook.png" alt="" /></span></a>
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
            <a href="/login">Tentang S2C</a>
            <a href="/login">Jadwal</a>
            <a href="/register">Manfaat</a>
            <a href="/register">Timeline</a>
            <a href="/register">FAQ</a>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>LEGAL</div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Services</a>
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
