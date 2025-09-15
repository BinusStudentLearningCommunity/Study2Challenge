import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import apiClient from "../../services/apiClient";
import DashboardNavbar from "../../components/layout/DashboardNavbar/DashboardNavbar";
import styles from "./ProposalPage.module.css";

interface Team {
  _id: string;
  teamName: string;
  teamCode: string;
  members: Array<{
    _id: string;
    fullName: string;
    role: string;
    email: string;
  }>;
}

const ProposalPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, [user]);

  const fetchTeamData = async () => {
    try {
      const response = await apiClient.get<Team>("/teams/me");
      setTeam(response.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = () => {
    navigate("/dashboard");
  };

  const handleJoinTeam = () => {
    navigate("/dashboard");
  };

  const handleSubmitProposal = () => {
    window.open("https://bit.ly/ProposalPesertaS2C", "_blank");
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <DashboardNavbar />
      <div className={styles.pageContainer}>
        {/* Background Elements */}
        <img
          src="/assets/galaxy-orbit-2.png"
          alt="Yellow Galaxy"
          className={styles.yellowGalaxy}
        />
        <img
          src="/assets/astronautFall_blue 1.png"
          alt="Blue Astronaut"
          className={styles.blueAstronaut}
        />
        <img
          src="/assets/Clip path group 4.png"
          alt="Yellow Clip Path"
          className={styles.yellowClipPath}
        />
        <img
          src="/assets/Clip path group 3.png"
          alt="Blue Clip Path"
          className={styles.blueClipPath}
        />

        <motion.div
          className={styles.contentContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>Proposal Submission</h1>

          {!team ? (
            <div className={styles.noTeamSection}>
              <h2>You haven't joined a team yet!</h2>
              <p>Create or join a team first to submit your proposal.</p>
              <div className={styles.buttonGroup}>
                <motion.button
                  className={styles.primaryButton}
                  onClick={handleCreateTeam}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Team
                </motion.button>
                <motion.button
                  className={styles.secondaryButton}
                  onClick={handleJoinTeam}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Team
                </motion.button>
              </div>
            </div>
          ) : (
            <div className={styles.proposalSection}>
              <div className={styles.teamInfo}>
                <h2>{team.teamName}</h2>
                <p className={styles.teamCode}>Team Code: {team.teamCode}</p>
              </div>

              <div className={styles.rulesContainer}>
                <h3>📌 Submission Rules</h3>
                <div className={styles.rulesList}>
                  <p>• Only team leader can submit the proposal</p>
                  <p>
                    • Submission period: September 15 - 21, 2025 (23:59 WIB)
                  </p>
                  <p>
                    • File format: PDF with name format "[TeamName]_Proposal
                    Hackathon Study2Challenge 2025.pdf"
                  </p>
                  <p>• Maximum file size: 5 MB</p>
                  <p>
                    • Maximum length: 15 pages (including cover & attachments)
                  </p>
                </div>

                <h3>📝 Writing Format</h3>
                <div className={styles.formatRules}>
                  <ul>
                    <li>Font: Times New Roman</li>
                    <li>Font Size: Title (14pt), Content (12pt)</li>
                    <li>Line Spacing: 1.5</li>
                    <li>Margin: 2.5 cm on all sides</li>
                    <li>References: APA format (if using external sources)</li>
                  </ul>
                </div>

                <div className={styles.resources}>
                  <a
                    href="https://bit.ly/TemplateProposalPesertaS2C"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.templateLink}
                  >
                    📑 Download Proposal Template
                  </a>
                </div>

                <div className={styles.leaderOnlyMessage}>
                  ⚠️ Only team leader can submit the proposal.
                </div>

                <div className={styles.buttonGroup}>
                  <motion.button
                    className={styles.primaryButton}
                    onClick={handleSubmitProposal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit Proposal
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ProposalPage;
