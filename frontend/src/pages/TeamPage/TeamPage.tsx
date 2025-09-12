import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";
import styles from "./TeamPage.module.css";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import DashboardNavbar from "../../components/layout/DashboardNavbar/DashboardNavbar";

interface TeamMember {
  _id: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  whatsappNumber: string;
  institution: string;
  idCardUrl: string;
  twibbonLink: string;
  role: string;
}

interface Team {
  _id: string;
  teamName: string;
  teamCode: string;
  isPay: boolean;
  isQualified: boolean;
  isLock: boolean;
  paymentProofUrl: string;
  members: TeamMember[];
}

const TeamPage = () => {
  const { user } = useAuth();
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
      toast.error("Failed to fetch team data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading team data...</div>;
  }

  if (!team) {
    return (
      <>
        <DashboardNavbar />
        <div className={styles.noTeamContainer}>
          <h2>You haven't joined a team yet!</h2>
          <p>
            Register your team or join an existing team to see the details here.
          </p>
        </div>
      </>
    );
  }

  const getStatusStyle = (isVerified: boolean) => {
    return isVerified ? styles.verified : styles.pending;
  };

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
          className={styles.teamContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.teamHeader}>
            <h1>{team.teamName}</h1>
            <div className={styles.teamCode}>Team Code: {team.teamCode}</div>
          </div>

          <div className={styles.statusSection}>
            <div className={styles.statusCard}>
              <h3>Payment Status</h3>
              <span className={getStatusStyle(team.isPay)}>
                {team.isPay ? "Verified" : "Pending"}
              </span>
              {!team.isPay && team.paymentProofUrl && (
                <p className={styles.pendingNote}>
                  Your payment is being verified
                </p>
              )}
            </div>

            <div className={styles.statusCard}>
              <h3>Qualification Status</h3>
              <span className={getStatusStyle(team.isQualified)}>
                {team.isQualified ? "Qualified" : "Not Qualified Yet"}
              </span>
            </div>
          </div>

          <div className={styles.paymentSection}>
            <h2>Payment Proof</h2>
            {team.paymentProofUrl ? (
              <div className={styles.paymentProof}>
                <img
                  src={team.paymentProofUrl}
                  alt="Payment Proof"
                  onClick={() => window.open(team.paymentProofUrl, "_blank")}
                />
              </div>
            ) : (
              <p className={styles.noPayment}>No payment proof uploaded yet</p>
            )}
          </div>

          <div className={styles.membersSection}>
            <h2>Team Members</h2>
            <div className={styles.membersGrid}>
              {team.members.map((member) => (
                <motion.div
                  key={member._id}
                  className={styles.memberCard}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={styles.memberHeader}>
                    <h3>{member.fullName}</h3>
                    <span className={styles.role}>{member.role}</span>
                  </div>

                  <div className={styles.memberDetails}>
                    <div className={styles.idCard}>
                      <img
                        src={member.idCardUrl}
                        alt="ID Card"
                        onClick={() => window.open(member.idCardUrl, "_blank")}
                      />
                    </div>

                    <div className={styles.memberInfo}>
                      <p>
                        <strong>Email:</strong> {member.email}
                      </p>
                      <p>
                        <strong>Institution:</strong> {member.institution}
                      </p>
                      <p>
                        <strong>WhatsApp:</strong> {member.whatsappNumber}
                      </p>
                      <p>
                        <strong>Gender:</strong> {member.gender}
                      </p>
                      <p>
                        <strong>Date of Birth:</strong>{" "}
                        {new Date(member.dateOfBirth).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Twibbon:</strong>{" "}
                        <a
                          href={member.twibbonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default TeamPage;
