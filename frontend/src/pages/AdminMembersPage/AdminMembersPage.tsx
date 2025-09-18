import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import DashboardNavbar from "../../components/layout/DashboardNavbar/DashboardNavbar";
import styles from "./AdminMembersPage.module.css";
import { useNavigate } from "react-router-dom";

interface Member {
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
  team: {
    _id: string;
    teamName: string;
    teamCode: string;
    isPay: boolean;
    isQualified: boolean;
  };
}

const AdminMembersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "all", // all, leader, member
    gender: "all", // all, male, female
    payment: "all", // all, paid, unpaid
    qualification: "all", // all, qualified, unqualified
  });
  const [sortBy, setSortBy] = useState("name"); // name, team, institution

  useEffect(() => {
    if (user?.email !== "s2cadmin@gmail.com") {
      navigate("/dashboard");
      return;
    }
    fetchMembers();
  }, [user, navigate]);

  const fetchMembers = async () => {
    try {
      const response = await apiClient.get<Member[]>("/admin/members");
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch members");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort members
  useEffect(() => {
    let result = [...members];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (member) =>
          member.fullName.toLowerCase().includes(query) ||
          member.team.teamName.toLowerCase().includes(query) ||
          member.team.teamCode.toLowerCase().includes(query) ||
          member.whatsappNumber.includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.institution.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.role !== "all") {
      result = result.filter(
        (member) =>
          (filters.role === "leader" && member.role === "Ketua Tim") ||
          (filters.role === "member" && member.role !== "Ketua Tim")
      );
    }

    if (filters.gender !== "all") {
      result = result.filter(
        (member) => member.gender.toLowerCase() === filters.gender
      );
    }

    if (filters.payment !== "all") {
      result = result.filter((member) =>
        filters.payment === "paid" ? member.team.isPay : !member.team.isPay
      );
    }

    if (filters.qualification !== "all") {
      result = result.filter((member) =>
        filters.qualification === "qualified"
          ? member.team.isQualified
          : !member.team.isQualified
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "team":
          return a.team.teamName.localeCompare(b.team.teamName);
        case "institution":
          return a.institution.localeCompare(b.institution);
        default:
          return 0;
      }
    });

    setFilteredMembers(result);
  }, [members, searchQuery, filters, sortBy]);

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading members...</div>;
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

        <div className={styles.contentContainer}>
          <div className={styles.header}>
            <h1>Registered Members</h1>
            <span className={styles.memberCount}>
              Total: {members.length} members
            </span>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search by name, team, phone number, email, or institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.filterControls}>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
              >
                <option value="all">All Roles</option>
                <option value="leader">Team Leaders</option>
                <option value="member">Members</option>
              </select>

              <select
                value={filters.gender}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <select
                value={filters.payment}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, payment: e.target.value }))
                }
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>

              <select
                value={filters.qualification}
                onChange={(e) =>
                  setFilters((prev) => ({
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
                <option value="name">Sort by Name</option>
                <option value="team">Sort by Team</option>
                <option value="institution">Sort by Institution</option>
              </select>
            </div>
          </div>

          <div className={styles.membersTable}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Team</th>
                  <th>Role</th>
                  <th>Institution</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member._id}>
                    <td>{member.fullName}</td>
                    <td>
                      <div className={styles.teamInfo}>
                        <span>{member.team.teamName}</span>
                        <small>({member.team.teamCode})</small>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.roleTag} ${
                          member.role === "Ketua Tim"
                            ? styles.leaderTag
                            : styles.memberTag
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td>{member.institution}</td>
                    <td>
                      <div className={styles.contactInfo}>
                        <small>{member.whatsappNumber}</small>
                        <small>{member.email}</small>
                      </div>
                    </td>
                    <td>
                      <div className={styles.statusTags}>
                        <span
                          className={`${styles.statusTag} ${
                            member.team.isPay
                              ? styles.paidTag
                              : styles.unpaidTag
                          }`}
                        >
                          {member.team.isPay ? "Paid" : "Unpaid"}
                        </span>
                        <span
                          className={`${styles.statusTag} ${
                            member.team.isQualified
                              ? styles.qualifiedTag
                              : styles.unqualifiedTag
                          }`}
                        >
                          {member.team.isQualified
                            ? "Qualified"
                            : "Not Qualified"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <motion.button
                        className={styles.viewButton}
                        onClick={() => setSelectedMember(member)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Member Details Modal */}
        {selectedMember && (
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedMember(null)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2>{selectedMember.fullName}</h2>
              <div className={styles.modalContent}>
                <div className={styles.modalImageSection}>
                  <div className={styles.idCardSection}>
                    <h3>ID Card</h3>
                    <img
                      src={selectedMember.idCardUrl}
                      alt="ID Card"
                      onClick={() =>
                        window.open(selectedMember.idCardUrl, "_blank")
                      }
                    />
                  </div>
                  <a
                    href={selectedMember.twibbonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.twibbonLink}
                  >
                    View Twibbon
                  </a>
                </div>

                <div className={styles.modalDetails}>
                  <div className={styles.detailItem}>
                    <strong>Team:</strong> {selectedMember.team.teamName} (
                    {selectedMember.team.teamCode})
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Role:</strong> {selectedMember.role}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Gender:</strong> {selectedMember.gender}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(selectedMember.dateOfBirth).toLocaleDateString()}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Institution:</strong> {selectedMember.institution}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Email:</strong> {selectedMember.email}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>WhatsApp:</strong> {selectedMember.whatsappNumber}
                  </div>
                </div>
              </div>

              <motion.button
                className={styles.closeButton}
                onClick={() => setSelectedMember(null)}
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

export default AdminMembersPage;
