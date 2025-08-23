import { useState } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../../components/Countdown/Countdown';
import styles from './HomePage.module.css';
import { motion, type Variants } from 'framer-motion';

import Cakap from '../../../public/assets/sponsors/cakap-logo.png';
import DewaWeb from '../../../public/assets/sponsors/dewaweb.png';

// FAQ data - commonly asked questions about the competition
const faqs = [
  {
    question: "Apa itu STUDY 2 CHALLENGE 2025?",
    answer: "STUDY 2 CHALLENGE 2025 adalah kompetisi hackathon nasional tahunan dari BINUS Student Learning Community (BSLC). Tahun ini, kompetisi berfokus pada pengembangan aplikasi berbasis website untuk merespons permasalahan global yang mengacu pada Sustainable Development Goals (SDGs) 1 hingga 4."
  },
  { 
    question: "Siapa saja yang boleh mendaftar?", 
    answer: "Kompetisi ini terbuka untuk Siswa SMA dan Mahasiswa aktif dari seluruh Indonesia. Peserta harus mendaftar dalam bentuk tim yang terdiri dari 1 hingga 3 orang." 
  },
  { 
    question: "Apa saja output yang harus dikumpulkan?", 
    answer: "Tim yang lolos seleksi proposal harus mengimplementasikan idenya dalam bentuk aplikasi berbasis website (minimal viable product) dan membuat sebuah video pitch deck berdurasi maksimal 4 menit yang berisi demo dan penjelasan aplikasi." 
  },
  { 
    question: "Bagaimana proses penilaiannya?", 
    answer: "Penilaian awal dilakukan berdasarkan proposal ide yang dikirimkan. Penilaian akhir akan didasarkan pada kualitas implementasi aplikasi, kreativitas, kebermanfaatan, serta kemampuan komunikasi tim melalui video pitch. Tidak ada sesi presentasi final secara langsung." 
  },
  { 
    question: "Apa saja manfaat yang didapatkan?", 
    answer: "Peserta akan mendapatkan pengalaman kompetisi nasional, meningkatkan kemampuan berpikir kritis, kreatif, dan kolaborasi. Setiap peserta akan mendapatkan sertifikat partisipasi, dan para pemenang akan memperoleh hadiah yang telah ditetapkan." 
  }
];

const HomePage = () => {
  // State to track which FAQ item is currently open
  const [openIndex, setOpenIndex] = useState(0);
  
  // Toggle FAQ item open/close
  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const hoverEffect = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className={styles.homePage}>
      {/* Background decorative elements - these add visual flair to different sections */}
      <div className={styles.decorativeElements}>
        <img src="/assets/Group 106.png" alt="Decorative element" className={`${styles.decorativeImage} ${styles.leftTop}`} />
        <img src="/assets/astrounotFall_black 1.png" alt="Decorative element" className={`${styles.decorativeImage} ${styles.leftBottom}`} />

        <img src="/assets/galaxy_black 1.png" alt="Decorative element" className={`${styles.decorativeImage} ${styles.rightTop}`} />
        <img src="/assets/Group 107.png" alt="Decorative element" className={`${styles.decorativeImage} ${styles.rightBottom}`} />

        {/* Why Join section decorations */}
        <img src="/assets/code_background 3.png" alt="Decorative element" className={`${styles.decorativeImage} ${styles.whyJoinSectionCode}`} />
        <img src="/assets/astrounotFall_black 3.png" alt="Decorative element" className={`${styles.decorativeImage} ${styles.whyJoinSectionTopRight}`} />

        {/* Timeline section decorations */}
        <img src="/assets/Clip path group.png" alt="Decorative element" className={`${styles.decorativeImage} ${styles.timelineClip1}`} />
        <img src="/assets/Clip path group (1).png" alt="Decorative element" className={`${styles.decorativeImage} ${styles.timelineClip2}`} />
      </div>

      {/* Hero section - main landing area with countdown and registration */}
      <section className={styles.Hero} id='Hero'>
        <div className={styles.heroText}>
          <h1>STUDY 2 CHALLENGE 2025</h1>
          <h2>BRIDGING GLOBAL PROBLEMS: TECH FOR A BETTER TOMORROW</h2>
          <p>Hackathon nasional online untuk siswa SMA dan mahasiswa Indonesia! Ciptakan solusi teknologi <br/>inovatif berbasis website untuk menjawab tantangan SDGs 1-4.</p>
        </div>
        <hr />
        <Countdown targetDate="2025-09-21T23:59:59"/>
        <Link to="/dashboard" className={styles.heroButton}>
          DAFTAR SEKARANG
        </Link>
        <p className={styles.heroPrice}>(Rp 100.000/Tim) !</p>
      </section>

      {/* Why Join section - explains the benefits of participating */}
      <motion.section
        className={styles.whyJoinSection}
        id='WhyJoin'
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          animate={{
            textShadow: [
              "0 0 5px rgba(22, 99, 229, 0.6)",   
              "0 0 12px rgba(49, 113, 223, 1)",  
              "0 0 5px rgba(22, 99, 229, 0.6)", 
            ],
          }}
          transition={{
            duration: 3.5,     
            repeat: Infinity,  
            repeatType: "mirror",
          }}
        >
          Mengapa Bergabung dengan Study 2 Challenge 2025?
        </motion.h2>
        <hr />
        
        <motion.div 
          className={styles.cardsGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          {/* Top row cards */}
          <motion.div className={`${styles.card} ${styles.card1}`} variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
            <div className={`${styles.cardIcon} ${styles.orange}`}>
              <img src="/assets/public.png" alt="Public icon" />
            </div>
            <div className={styles.cardContainer}>
              <h3 className={styles.cardTitle}>Kontribusi nyata untuk SDGs (Pengentasan Kemiskinan, Sistem Pangan, Kesehatan, Pendidikan).</h3>
              <p className={styles.cardDescription}>Berkontribusi langsung dalam mendukung tujuan global seperti pengentasan kemiskinan, perbaikan sistem pangan, kesehatan, dan pendidikan melalui proyek dan ide yang berdampak.</p>
            </div>
          </motion.div>
          
          <motion.div className={`${styles.card} ${styles.card2}`} variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
            <div className={`${styles.cardIcon} ${styles.blue}`}>
              <img src="/assets/psychology.png" alt="Psychology icon" />
            </div>
            <div className={styles.cardContainer}>
              <h3 className={styles.cardTitle}>Asah Critical & Creative Thinking serta Global Standard Technical Competencies.</h3>
              <p className={styles.cardDescription}>Mengembangkan kemampuan berpikir kritis dan kreatif sekaligus meningkatkan kompetensi teknis yang diakui secara global.</p>
            </div>
          </motion.div>
          
          {/* Bottom row cards */}
          <div className={styles.bottomRow}>
            <motion.div className={styles.card} variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
              <div className={`${styles.cardIcon} ${styles.blue}`}>
                <img src="/assets/groups.png" alt="Groups icon" />
              </div>
              <div className={styles.cardContainer}>
                <h3 className={styles.cardTitle}>Tingkatkan Collaboration & Digital Fluency.</h3>
                <p className={styles.cardDescription}>Meningkatkan kemampuan bekerja sama dalam tim dan menguasai keterampilan teknologi digital yang penting di era modern.</p>
              </div>
            </motion.div>
            
            <motion.div className={`${styles.card} ${styles.cardMiddle}`} variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
              <div className={`${styles.cardIcon} ${styles.orange}`}>
                <img src="/assets/military_tech.png" alt="Military tech icon" />
              </div>
              <div className={styles.cardContainer}>
                <h3 className={styles.cardTitle}>Pengalaman kompetisi tingkat nasional dari BINUS Student Learning Community.</h3>
                <p className={styles.cardDescription}>Dapatkan kesempatan untuk merasakan atmosfer kompetisi tingkat nasional yang menantang dan memperluas jaringan.</p>
              </div>
            </motion.div>
            
            <motion.div className={styles.card} variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
              <div className={`${styles.cardIcon} ${styles.blue}`}>
                <img src="/assets/card_giftcard.png" alt="Gift card icon" />
              </div>
              <div className={styles.cardContainer}>
                <h3 className={styles.cardTitle}>Menangkan hadiah menarik & dapatkan sertifikat nasional.</h3>
                <p className={styles.cardDescription}>Raih penghargaan, hadiah, serta sertifikat resmi sebagai bukti partisipasi dan pencapaian dalam ajang bergengsi ini.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* SDGs section - showcases the sustainable development goals */}
      <motion.section
        className={styles.SDGs}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          animate={{
            textShadow: [
              "0 0 15px rgba(196, 143, 67, 0.6)",
              "0 0 25px rgba(196, 143, 67, 1)",
              "0 0 15px rgba(196, 143, 67, 0.6)", 
            ]
          }}
          transition={{
            duration: 3.5,     
            repeat: Infinity,  
            repeatType: "mirror",
          }}
        >
          Sustainable Development Goals
        </motion.h2>
        <hr />
        <div className={styles.sdgContainer}>
          <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap"><img src="/assets/Group 98.png" alt="SDG 1 - No Poverty" /></motion.div>
          <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap"><img src="/assets/Group 99.png" alt="SDG 2 - Zero Hunger" /></motion.div>
          <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap"><img src="/assets/Group 100.png" alt="SDG 3 - Good Health and Well-being" /></motion.div>
          <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap"><img src="/assets/Group 101.png" alt="SDG 4 - Quality Education" /></motion.div>
        </div>
      </motion.section>

      {/* Timeline section - shows the competition schedule */}
      <motion.section
        className={styles.Timeline}
        id="Timeline"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          animate={{
            textShadow: [
              "0 0 5px rgba(22, 99, 229, 0.6)",   
              "0 0 12px rgba(49, 113, 223, 1)",  
              "0 0 5px rgba(22, 99, 229, 0.6)", 
            ],
          }}
          transition={{
            duration: 3.5,     
            repeat: Infinity,  
            repeatType: "mirror",
          }}
        >
          Timeline
        </motion.h2>
        <hr />
        <div className={styles.timelineContainer}>
            {/* Registration & Proposal Submission */}
            <div className={styles.timelineItem}>
                <div className={styles.timelineSide}>
                    <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
                      <div className={styles.timelineDate}>
                          <span>25 Agustus – 21 September 2025</span>
                      </div>
                    </motion.div>
                </div>
                <div className={styles.timelineSide}>
                    <div className={styles.timelineDetails}>
                        <h3 className={styles.timelineTitle}>Pendaftaran & Pengumpulan Proposal</h3>
                        <p className={styles.timelineDescription}>
                          Tim mendaftarkan diri dan mengirimkan proposal ide aplikasi yang mencakup latar belakang masalah, solusi, dan teknologi yang akan digunakan
                        </p>
                    </div>
                </div>
            </div>

            {/* Proposal Selection */}
            <div className={`${styles.timelineItem} ${styles.reverse}`}>
                <div className={styles.timelineSide}>
                    <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
                      <div className={styles.timelineDate}>
                          <span>22 September – 26 September 2025</span>
                      </div>
                    </motion.div>
                </div>
                <div className={styles.timelineSide}>
                    <div className={styles.timelineDetails}>
                        <h3 className={styles.timelineTitle}>Seleksi Proposal</h3>
                        <p className={styles.timelineDescription}>
                          Proposal yang terkumpul akan dinilai berdasarkan ide dan konsep yang ditawarkan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Announcement of Selected Participants */}
            <div className={styles.timelineItem}>
                <div className={styles.timelineSide}>
                    <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
                      <div className={styles.timelineDate}>
                          <span>27 September 2025</span>
                      </div>
                    </motion.div>
                </div>
                <div className={styles.timelineSide}>
                    <div className={styles.timelineDetails}>
                        <h3 className={styles.timelineTitle}>Pengumuman Peserta Lolos</h3>
                        <p className={styles.timelineDescription}>
                          Pengumuman tim yang berhasil lolos seleksi proposal dan maju ke tahap pengembangan aplikasi.
                        </p>
                    </div>
                </div>
            </div>

            {/* Technical Meeting */}
            <div className={`${styles.timelineItem} ${styles.reverse}`}>
                <div className={styles.timelineSide}>
                    <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
                      <div className={styles.timelineDate}>
                          <span>28 September 2025</span>
                      </div>
                    </motion.div>
                </div>
                <div className={styles.timelineSide}>
                    <div className={styles.timelineDetails}>
                        <h3 className={styles.timelineTitle}>Technical Meeting</h3>
                        <p className={styles.timelineDescription}>
                        Sesi penjelasan teknis mengenai alur tahap implementasi, aturan kompetisi, dan sesi tanya jawab.
                        </p>
                    </div>
                </div>
            </div>

            {/* Implementation Phase */}
            <div className={styles.timelineItem}>
                <div className={styles.timelineSide}>
                    <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
                      <div className={styles.timelineDate}>
                          <span>29 September – 12 Oktober 2025</span>
                      </div>
                    </motion.div>
                </div>
                <div className={styles.timelineSide}>
                    <div className={styles.timelineDetails}>
                        <h3 className={styles.timelineTitle}>Tahap Implementasi / Coding</h3>
                        <p className={styles.timelineDescription}>
                          Peserta merealisasikan ide pada proposal menjadi sebuah produk aplikasi berbasis website.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Judging */}
            <div className={`${styles.timelineItem} ${styles.reverse}`}>
                <div className={styles.timelineSide}>
                    <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
                      <div className={styles.timelineDate}>
                          <span>13 Oktober – 19 Oktober 2025</span>
                      </div>
                    </motion.div>
                </div>
                <div className={styles.timelineSide}>
                    <div className={styles.timelineDetails}>
                        <h3 className={styles.timelineTitle}>Penilaian Karya</h3>
                        <p className={styles.timelineDescription}>
                          Penjurian akhir akan didasarkan pada kualitas implementasi aplikasi, kesesuaian solusi dengan tema, kreativitas, serta video pitching yang dibuat.
                        </p>
                    </div>
                </div>
            </div>

            {/* Winner Announcement */}
            <div className={styles.timelineItem}>
                <div className={styles.timelineSide}>
                    <motion.div variants={{...fadeIn, ...hoverEffect}} whileHover="hover" whileTap="tap">
                      <div className={styles.timelineDate}>
                          <span>20 Oktober 2025</span>
                      </div>
                    </motion.div>
                </div>
                <div className={styles.timelineSide}>
                    <div className={styles.timelineDetails}>
                        <h3 className={styles.timelineTitle}>Pengumuman Pemenang</h3>
                        <p className={styles.timelineDescription}>
                          Pengumuman pemenang kompetisi yang akan dilakukan melalui platform resmi BSLC.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </motion.section>

      {/* Sponsors section - showcases competition sponsors */}
      <motion.section
        className={styles.Sponsor}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className={styles.sponsorTitleContainer}>
          <img src="/assets/sparkle-gold-1.png" alt="Sparkle left" className={styles.sponsorTitleLeft} />
          <div className={styles.sponsorTitleCenter}>
            <motion.h2
              animate={{
                textShadow: [
                  "0 0 5px rgba(196, 143, 67, 0.6)",
                  "0 0 12px rgba(196, 143, 67, 1)",
                  "0 0 5px rgba(196, 143, 67, 0.6)",
                ],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            >
              Sponsor
            </motion.h2>
            <hr />
          </div>
          <img src="/assets/sparkle-gold-2.png" alt="Sparkle right" className={styles.sponsorTitleRight} />
        </div>

        {/* Gold Tier */}
        <h3>Gold Sponsors</h3>
        <div className={styles.sponsorGrid}>
          <div className={styles.sponsorCard}>
            <img src={DewaWeb} alt="Dewa Web" className={styles.sponsor} />
          </div>
          <div className={styles.sponsorCard}>

          </div>
        </div>

        {/* Silver Tier */}
        <h3>Silver Sponsors</h3>
        <div className={styles.sponsorGrid}>
          <div className={styles.sponsorCard}>
            <img src={Cakap} alt="Cakap" className={styles.sponsor} />
          </div>
          <div className={styles.sponsorCard}></div>
          <div className={styles.sponsorCard}></div>
        </div>

        {/* Bronze Tier */}
        <h3>Bronze Sponsors</h3>
        <div className={styles.sponsorGrid}>
          <div className={styles.sponsorCard}></div>
          <div className={styles.sponsorCard}></div>
          <div className={styles.sponsorCard}></div>
          <div className={styles.sponsorCard}></div>
        </div>
      </motion.section>

      {/* Media Partners section - showcases media partners */}
      <motion.section
        className={styles.MediaPartner}
        id='MedPar'
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className={styles.mediaPartnerTitleContainer}>
          <img src="/assets/Group 127.png" alt="Decorative element" className={styles.mediaPartnerTitleLeft} />
          <div className={styles.mediaPartnerTitleCenter}>
            <motion.h2
              animate={{
                textShadow: [
                  "0 0 5px rgba(22, 99, 229, 0.6)",   
                  "0 0 12px rgba(49, 113, 223, 1)",  
                  "0 0 5px rgba(22, 99, 229, 0.6)", 
                ],
              }}
              transition={{
                duration: 3.5,     
                repeat: Infinity,  
                repeatType: "mirror",
              }}
            >
              OUR MEDIA PARTNERS
            </motion.h2>
            <hr />
          </div>
          <img src="/assets/Group 127.png" alt="Decorative element" className={styles.mediaPartnerTitleRight} style={{ transform: 'scaleX(-1)' }} />
        </div>
        <div className={styles.sponsorGrid}>
          {/* Media partner cards - placeholder for actual partner logos */}
          {Array.from({ length: 16 }, (_, index) => (
            <div key={index} className={styles.sponsorCard}></div>
          ))}
        </div>
      </motion.section>

      {/* FAQ section - frequently asked questions */}
      <motion.section
        className={styles.FAQSection}
        id='Faq'
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className={styles.faqGrid}>
          <div className={styles.faqLeft}>
            <motion.h2
              animate={{
                textShadow: [
                  "0 0 15px rgba(196, 143, 67, 0.6)",
                  "0 0 25px rgba(196, 143, 67, 0.9)",
                  "0 0 15px rgba(196, 143, 67, 0.6)", 
                ]
              }}
              transition={{
                duration: 3.5,     
                repeat: Infinity,  
                repeatType: "mirror",
              }}
            >
              FREQUENTLY ASKED QUESTIONS
            </motion.h2>
            <hr />
            <p className={styles.faqIntro}>
              Temukan jawaban atas pertanyaan yang paling sering diajukan mengenai alur, pendaftaran, dan teknis kompetisi. Jika pertanyaan tidak terjawab di sini, jangan ragu untuk menghubungi kami di (nomor wa CP/ig s2c).
            </p>
            <div className={styles.faqStars}>
              <img src="/assets/Group 126.png" alt="Decorative stars" />
            </div>
          </div>
          <div className={styles.faqRight}>
            {faqs.map((faq, idx) => (
              <div  
                key={idx}
                className={`${styles.faqItem} ${openIndex === idx ? styles.active : ""}`}
              >
                <div className={styles.faqQuestion} onClick={() => handleToggle(idx)}>
                  <span className={styles.faqIcon}>?</span>
                  <span className={styles.faqQText}>{faq.question}</span>
                  <span className={styles.faqArrow}>
                    {openIndex === idx ? "⮟" : "⮝"}
                  </span>
                </div>
                <div className={styles.faqAnswer}>{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Organizer section - information about BSLC */}
      <motion.section
        className={styles.organizerSection}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className={styles.organizerGrid}>
          <div className={styles.organizerImagesLeft}>
            <img src="/assets/Group 89.png" alt="BSLC activity" className={styles.organizerSmallImg} />
            <img src="/assets/Group 90.png" alt="BSLC activity" className={styles.organizerSmallImg} />
            <img src="/assets/Group 91.png" alt="BSLC activity" className={styles.organizerSmallImg} />
          </div>
          <div className={styles.organizerImageMain}>
            <img src="/assets/Group 79.png" alt="BSLC Logo" className={styles.organizerBigImg} />
          </div>
          <div className={styles.organizerContent}>
            <motion.div
              className={styles.organizerButtonWrapper}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://new.bslc.or.id/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.organizerButton}
              >
                check us out!
              </a>
            </motion.div>
            <h2>
              <span style={{ color: '#3FE0A8' }}>BINUS Student</span><br />
              <span style={{ color: '#C6FF43' }}>Learning Community</span>
            </h2>
            <p>
              BSLC (Binus Student Learning Community) adalah komunitas belajar mahasiswa di BINUS University yang bertujuan untuk mendukung keberhasilan akademik dan pengembangan diri mahasiswa. Melalui program mentoring dan tutoring, BSLC membantu mahasiswa baru dalam memahami materi kuliah dengan bimbingan dari mentor-mentor berpengalaman. Selain itu, BSLC juga mengadakan berbagai pelatihan dan kegiatan pengembangan soft skills, menjadikannya wadah kolaboratif yang aktif dan positif di lingkungan kampus.
            </p>
          </div>
        </div>
     </motion.section>
    </div>
  );
};

export default HomePage;