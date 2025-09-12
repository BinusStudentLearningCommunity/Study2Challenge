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
  paymentProofUrl: string;
  members: Array<{
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
  }>;
}

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState({
    payment: "all", // all, paid, unpaid
    qualification: "all", // all, qualified, unqualified
  });
  const [sortBy, setSortBy] = useState("teamName"); // teamName, members, status

  // Filter and sort teams
  useEffect(() => {
    let result = [...teams];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (team) =>
          team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.teamCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.members.some((member) =>
            member.fullName.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply status filters
    if (filterStatus.payment !== "all") {
      result = result.filter((team) =>
        filterStatus.payment === "paid" ? team.isPay : !team.isPay
      );
    }
    if (filterStatus.qualification !== "all") {
      result = result.filter((team) =>
        filterStatus.qualification === "qualified"
          ? team.isQualified
          : !team.isQualified
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "teamName":
          return a.teamName.localeCompare(b.teamName);
        case "members":
          return b.members.length - a.members.length;
        case "status":
          return (b.isPay ? 1 : 0) - (a.isPay ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredTeams(result);
  }, [teams, searchQuery, filterStatus, sortBy]);

  useEffect(() => {
    if (user?.email !== "s2cadmin@gmail.com") {
      navigate("/dashboard");
      return;
    }
    fetchTeams();
  }, [user, navigate]);

  const fetchTeams = async () => {
    try {
      const response = await apiClient.get<Team[]>("/admin/teams");
      setTeams(response.data);
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
          <div className={styles.teamsHeader}>
            <div className={styles.titleSection}>
              <h2 className={styles.sectionTitle}>Registered Teams</h2>
              <span className={styles.teamCount}>
                Total: {teams.length} teams
              </span>
            </div>

            <div className={styles.filterSection}>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  placeholder="Search teams or members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.filters}>
                <select
                  value={filterStatus.payment}
                  onChange={(e) =>
                    setFilterStatus((prev) => ({
                      ...prev,
                      payment: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>

                <select
                  value={filterStatus.qualification}
                  onChange={(e) =>
                    setFilterStatus((prev) => ({
                      ...prev,
                      qualification: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Qualifications</option>
                  <option value="qualified">Qualified</option>
                  <option value="unqualified">Not Qualified</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="teamName">Sort by Name</option>
                  <option value="members">Sort by Members</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.teamGrid}>
            {filteredTeams.map((team) => (
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
              <div className={styles.paymentProof}>
                <h3>Payment Proof</h3>
                <img
                  src={selectedTeam.paymentProofUrl}
                  alt="Payment Proof"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "300px",
                    objectFit: "contain",
                    marginBottom: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(selectedTeam.paymentProofUrl, "_blank")
                  }
                />
              </div>
              <div className={styles.membersGrid}>
                {selectedTeam.members.map((member) => (
                  <div key={member._id} className={styles.memberCard}>
                    <h4>{member.fullName}</h4>
                    <div className={styles.memberImage}>
                      <img
                        src={member.idCardUrl}
                        alt="ID Card"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "150px",
                          objectFit: "contain",
                          marginBottom: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(member.idCardUrl, "_blank")}
                      />
                    </div>
                    <p>
                      <strong>Role:</strong> {member.role}
                    </p>
                    <p>
                      <strong>Gender:</strong> {member.gender}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {new Date(member.dateOfBirth).toLocaleDateString()}
                    </p>
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
                      <strong>Twibbon:</strong>
                      <a
                        href={member.twibbonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Twibbon
                      </a>
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
