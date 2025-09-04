import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import DashboardNavbar from "../../components/layout/DashboardNavbar/DashboardNavbar.tsx";
import styles from "./AdminDashboardPage.module.css";
import { useNavigate } from "react-router-dom";

interface Team {
  _id: string;
  teamName: string;
  teamCode: string;
  isPay: boolean;
  isQualified: boolean;
  isLock: boolean;
  members: Array<{
    _id: string;
    name: string;
    nim: string;
    email: string;
    campus: string;
    major: string;
    phone: string;
    role: string;
  }>;
}

interface TeamResponse {
  teams: Team[];
}

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (user?.email !== "s2cadmin@gmail.com") {
      navigate("/");
      return;
    }
    fetchTeams();
  }, [user, navigate]);

  const fetchTeams = async () => {
    try {
      const response = await apiClient.get<TeamResponse>("/admin/teams");
      setTeams(response.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    teamId: string,
    status: { isPay?: boolean; isQualified?: boolean }
  ) => {
    try {
      await apiClient.patch(`/admin/teams/${teamId}/status`, status);
      toast.success("Status updated successfully");
      fetchTeams();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleViewDetails = async (teamId: string) => {
    try {
      const response = await apiClient.get<Team>(`/admin/teams/${teamId}`);
      setSelectedTeam(response.data);
    } catch (error) {
      console.error("Error fetching team details:", error);
      toast.error("Failed to fetch team details");
    }
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading dashboard...</div>;
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <DashboardNavbar />
      <div>
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
      </div>
      <div className={styles.dashboardContainer}>
        <div className={styles.greetingsContainer}>
          <h1 className={styles.greetings}>Welcome, Admin!</h1>
        </div>

        <div className={styles.teamsContainer}>
          <h2 className={styles.sectionTitle}>Registered Teams</h2>
          <div className={styles.teamGrid}>
            {teams.map((team) => (
              <motion.div
                key={team._id}
                className={styles.teamCard}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className={styles.teamName}>{team.teamName}</h3>
                <div className={styles.teamInfo}>
                  <p>Team Code: {team.teamCode}</p>
                  <p>Members: {team.members.length}</p>
                </div>
                <div className={styles.statusContainer}>
                  <div className={styles.statusGroup}>
                    <span>Payment Status:</span>
                    <motion.button
                      className={`${styles.statusButton} ${
                        team.isPay ? styles.verified : styles.pending
                      }`}
                      onClick={() =>
                        handleStatusUpdate(team._id, { isPay: !team.isPay })
                      }
                    >
                      {team.isPay ? "Verified" : "Pending"}
                    </motion.button>
                  </div>
                  <div className={styles.statusGroup}>
                    <span>Qualification:</span>
                    <motion.button
                      className={`${styles.statusButton} ${
                        team.isQualified
                          ? styles.qualified
                          : styles.notQualified
                      }`}
                      onClick={() =>
                        handleStatusUpdate(team._id, {
                          isQualified: !team.isQualified,
                        })
                      }
                    >
                      {team.isQualified ? "Qualified" : "Not Qualified"}
                    </motion.button>
                  </div>
                </div>
                <motion.button
                  className={styles.viewDetailsButton}
                  onClick={() => handleViewDetails(team._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {selectedTeam && (
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedTeam(null)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2>{selectedTeam.teamName} - Details</h2>
              <div className={styles.membersGrid}>
                {selectedTeam.members.map((member) => (
                  <div key={member._id} className={styles.memberCard}>
                    <h4>{member.name}</h4>
                    <p>
                      <strong>Role:</strong> {member.role}
                    </p>
                    <p>
                      <strong>NIM:</strong> {member.nim}
                    </p>
                    <p>
                      <strong>Email:</strong> {member.email}
                    </p>
                    <p>
                      <strong>Campus:</strong> {member.campus}
                    </p>
                    <p>
                      <strong>Major:</strong> {member.major}
                    </p>
                    <p>
                      <strong>Phone:</strong> {member.phone}
                    </p>
                  </div>
                ))}
              </div>
              <motion.button
                className={styles.closeButton}
                onClick={() => setSelectedTeam(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboardPage;
