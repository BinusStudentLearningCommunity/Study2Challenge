import React, { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import { useAuth } from "../../contexts/AuthContext";
import { registerTeam, getMyTeam } from "../../features/event/eventService";
import type { MemberDetails } from "../../features/event/eventService";

import styles from "./EventRegistrationPage.module.css";
import { FileText, Pencil, PlusCircle, Upload, UsersRound } from "lucide-react";

const blankMember: MemberDetails = {
  fullName: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  whatsappNumber: "",
  institution: "",
  idCardUrl: "",
  idCardPreviewUrl: "",
  twibbonLink: "",
  role: "",
};

type FormStep = "team-name" | "members-info" | "payment";

const EventRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<FormStep>("team-name");
  const [isDragging, setIsDragging] = useState(false);

  // Form data
  const [teamName, setTeamName] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [creatorDetails, setCreatorDetails] = useState<MemberDetails>({
    fullName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    whatsappNumber: "",
    institution: "",
    idCardUrl: "",
    twibbonLink: "",
  });
  const [teamMembers, setTeamMembers] = useState<MemberDetails[]>([]);

  // Create refs for file inputs
  const leaderFileRef = useRef<HTMLInputElement>(null);
  const paymentFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkStatusAndPrefill = async () => {
      try {
        await getMyTeam();
        toast.error("You are already registered in a team.");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch {
        console.log("User does not have a team. Displaying registration form.");
        if (user?.name) {
          setCreatorDetails((prev) => ({
            ...prev,
            fullName: user.name,
            email: user.email,
          }));
        }
        setIsLoading(false);
      }
    };

    checkStatusAndPrefill();
  }, [user, navigate]);

  const registrationDeadline = new Date('2025-09-22T00:30:00');
  const now = new Date();

  if (now > registrationDeadline) {
    return (
      <div className={styles.container} style={{ textAlign: 'center' }}>
        <h1 className={styles.title}>REGISTRATION CLOSED</h1>
        <p className={styles.formSubtitle} style={{ fontSize: '1.2rem', marginTop: '20px' }}>
          Mohon maaf, pendaftaran untuk STUDY 2 CHALLENGE 2025 telah berakhir pada 21 September 2025.
        </p>
        <Link to="/dashboard" className={styles.backButton} style={{ marginTop: '40px' }}>
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  // Navigation handlers
  // Validate team name against requirements - with optional silent mode
  const validateTeamName = (showErrors: boolean = false): boolean => {
    // Check if team name is empty
    if (!teamName.trim()) {
      if (showErrors) toast.error("Mohon masukkan nama tim");
      return false;
    }

    // Check if team name is between 5-30 characters
    if (teamName.length < 5 || teamName.length > 30) {
      if (showErrors) toast.error("Nama tim harus 5-30 karakter");
      return false;
    }

    // Check if team name has special characters
    if (/[^\w\s]/.test(teamName)) {
      if (showErrors)
        toast.error(
          "Nama tim tidak boleh mengandung karakter spesial (., dll)"
        );
      return false;
    }

    // Check if team name is only numbers
    if (/^\d+$/.test(teamName)) {
      if (showErrors) toast.error("Nama tim tidak boleh hanya berisi angka");
      return false;
    }

    return true;
  };

  const goToNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentStep === "team-name") {
      if (!validateTeamName(true)) {
        // Show error toasts when trying to proceed
        return;
      }
      setCurrentStep("members-info");
    } else if (currentStep === "members-info") {
      // Validate leader info first
      if (!validateMemberInfo(creatorDetails, true)) {
        // Show error toasts when trying to proceed
        return;
      }

      // Validate team member info if any members added
      for (let i = 0; i < teamMembers.length; i++) {
        if (!validateMemberInfo(teamMembers[i], true)) {
          // Show error toasts when trying to proceed
          return;
        }
      }
      setCurrentStep("payment");
    }
  };

  // Function to validate if can navigate to a step
  const canNavigate = (fromStep: FormStep, toStep: FormStep): boolean => {
    if (fromStep === "team-name" && toStep === "members-info") {
      return validateTeamName(false); // Don't show error toasts during navigation checks
    }
    if (fromStep === "members-info" && toStep === "payment") {
      // Check leader and member info
      const leaderValid = validateMemberInfo(creatorDetails, false); // Don't show error toasts during navigation checks
      let membersValid = true;
      for (const member of teamMembers) {
        if (!validateMemberInfo(member, false)) {
          // Don't show error toasts during navigation checks
          membersValid = false;
          break;
        }
      }
      return leaderValid && membersValid;
    }
    return true;
  };

  const handleNavigateToStep = (step: FormStep) => {
    if (step === "team-name") {
      setCurrentStep("team-name");
      return;
    }

    if (step === "members-info") {
      if (
        currentStep === "payment" ||
        canNavigate("team-name", "members-info")
      ) {
        setCurrentStep("members-info");
        return;
      }
    }

    if (step === "payment") {
      if (
        currentStep === "members-info" &&
        canNavigate("members-info", "payment")
      ) {
        setCurrentStep("payment");
        return;
      }
    }

    // Show error if validation fails
    if (step !== currentStep) {
      // If trying to go to members-info from team-name, show specific validation errors
      if (step === "members-info" && currentStep === "team-name") {
        validateTeamName(true); // This will show specific error messages
      } else if (step === "payment" && currentStep === "members-info") {
        // Validate leader info with error messages
        validateMemberInfo(creatorDetails, true);

        // Validate team members with error messages
        for (let i = 0; i < teamMembers.length; i++) {
          validateMemberInfo(teamMembers[i], true);
        }
      } else {
        toast.error("Mohon selesaikan tahap saat ini terlebih dahulu");
      }
    }
  };

  // Validation for team member info
  const validateMemberInfo = (
    member: MemberDetails,
    showErrors: boolean = false
  ): boolean => {
    const requiredFields = [
      "fullName",
      "email",
      "dateOfBirth",
      "gender",
      "whatsappNumber",
      "institution",
      "idCardUrl",
      "twibbonLink",
    ];

    // A map to get user-friendly names for each field
    const fieldLabels: { [key: string]: string } = {
      fullName: "Nama Lengkap",
      email: "Email",
      dateOfBirth: "Tanggal Lahir",
      gender: "Jenis Kelamin",
      whatsappNumber: "Nomor WhatsApp",
      institution: "Institusi / Asal Sekolah",
      idCardUrl: "Kartu Mahasiswa / Pelajar",
      twibbonLink: "Link Instagram Post (Twibbon)",
    };

    for (const field of requiredFields) {
      if (!member[field as keyof MemberDetails]) {
        if (showErrors) {
          const label = fieldLabels[field] || "A required field";
          toast.error(
            `Mohon lengkapi kolom "${label}" untuk ${
              member.fullName || "anggota tim"
            }`
          );
        }
        return false;
      }
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(member.email)) {
      if (showErrors) toast.error(`Email untuk ${member.fullName} tidak valid`);
      return false;
    }

    // Validate WhatsApp number (must be numeric and at least 10 digits)
    if (!/^\d{10,}$/.test(member.whatsappNumber)) {
      if (showErrors)
        toast.error(`Nomor WhatsApp untuk ${member.fullName} tidak valid`);
      return false;
    }

    return true;
  };

  // Handlers for state changes
  const handleCreatorChange = (field: keyof MemberDetails, value: string) => {
    setCreatorDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (
    index: number,
    field: keyof MemberDetails,
    value: string
  ) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamMembers(updatedMembers);
  };

  const addMemberField = () => {
    if (teamMembers.length < 3) {
      setTeamMembers([...teamMembers, blankMember]);
    } else {
      toast.error("A team can have a maximum of 3 members.");
    }
  };

  const removeMemberField = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  // File upload handlers
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setPaymentFile(file);
        setPaymentProofUrl(URL.createObjectURL(file));
      } else {
        e.target.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        // Add validation
        setPaymentFile(file);
        setPaymentProofUrl(URL.createObjectURL(file));
      }
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentFile) {
      toast.error("Please upload your payment proof before submitting.");
      return;
    }
    if (
      !validateMemberInfo(creatorDetails, true) ||
      teamMembers.some((m) => !validateMemberInfo(m, true))
    ) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    // 1. Append all the files
    formData.append("paymentProof", paymentFile);
    if (creatorDetails.idCardUrl instanceof File) {
      formData.append("creatorIdCard", creatorDetails.idCardUrl);
    }
    teamMembers.forEach((member) => {
      if (member.idCardUrl instanceof File) {
        formData.append("memberIdCards", member.idCardUrl);
      }
    });

    // 2. Clean file data from the JSON details to avoid sending unnecessary data
    const cleanCreatorDetails = {
      ...creatorDetails,
      idCardUrl: "",
      idCardPreviewUrl: "",
    };
    const cleanTeamMembers = teamMembers.map((member) => ({
      ...member,
      idCardUrl: "",
      idCardPreviewUrl: "",
    }));

    // 3. Append the rest of the form data as JSON strings
    formData.append("teamName", teamName);
    formData.append("creatorDetails", JSON.stringify(cleanCreatorDetails));
    formData.append("teamMembers", JSON.stringify(cleanTeamMembers));

    try {
      // The service now accepts FormData directly
      const response = (await registerTeam(formData)) as { message?: string };
      toast.success(response.message || "Team registered successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const errResponse = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (errResponse?.data?.message) {
          errorMessage = errResponse.data.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const validateFile = (file: File): boolean => {
    const fiveMB = 5 * 1024 * 1024;
    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image (PNG, JPG, etc.).");
      return false;
    }
    if (file.size > fiveMB) {
      toast.error("File size cannot exceed 5MB.");
      return false;
    }
    return true;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p>Checking your team status...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Toaster position="bottom-right" />

      <Link to="/dashboard" className={styles.backButton}>
        &larr; Back to Dashboard
      </Link>

      <div className={styles.backgroundElements}>
        <div className={`${styles.decoElement} ${styles.topLeftGalaxy}`}></div>
        <div className={`${styles.decoElement} ${styles.topLeftSparkle}`}></div>

        <div className={`${styles.decoElement} ${styles.topRightGalaxy}`}></div>

        <div
          className={`${styles.decoElement} ${styles.midLeftSparkle1}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midLeftSparkle2}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midLeftSparkle3}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midLeftSparkle4}`}
        ></div>

        <div
          className={`${styles.decoElement} ${styles.midRightSparkle1}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midRightSparkle2}`}
        ></div>
        <div
          className={`${styles.decoElement} ${styles.midRightSparkle3}`}
        ></div>
      </div>

      <h1 className={styles.title}>STUDY 2 CHALLENGE 2025</h1>

      <div className={styles.formContainer}>
        <div className={styles.header}>
          {currentStep === "team-name" && (
            <>
              <h2 className={styles.formTitle}>PENAMAAN TIM</h2>
              <p className={styles.formSubtitle}>
                Masukkan nama tim dan pastikan semua validasi terpenuhi sebelum
                lanjut.
              </p>
            </>
          )}
          {currentStep === "members-info" && (
            <>
              <h2 className={styles.formTitle}>PENDATAAN TIM ANGGOTA</h2>
              <p className={styles.formSubtitle}>
                Isi data lengkap seluruh anggota tim, termasuk nama, email,
                kontak, dan institusi.
              </p>
            </>
          )}
          {currentStep === "payment" && (
            <>
              <h2 className={styles.formTitle}>PEMBAYARAN</h2>
              <p className={styles.formSubtitle}>
                Lakukan pembayaran sebesar Rp 100.000,00 dan unggah bukti
                transfer untuk menyelesaikan pendaftaran tim.
              </p>
            </>
          )}
        </div>

        {/* Progress Bar  */}
        <div className={styles.progressContainer}>
          <div
            className={`${styles.progressStep} ${
              currentStep === "team-name" ||
              currentStep === "members-info" ||
              currentStep === "payment"
                ? styles.active
                : ""
            }`}
            onClick={() => handleNavigateToStep("team-name")}
            style={{ cursor: "pointer" }}
          >
            <Pencil style={{ width: "16px", height: "16px" }} />
          </div>
          <div
            className={`${styles.progressLine} ${
              currentStep === "members-info" || currentStep === "payment"
                ? styles.completed
                : ""
            }`}
          ></div>
          <div
            className={`${styles.progressStep} ${
              currentStep === "members-info" || currentStep === "payment"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              canNavigate("team-name", "members-info") &&
              handleNavigateToStep("members-info")
            }
            style={{
              cursor: canNavigate("team-name", "members-info")
                ? "pointer"
                : "not-allowed",
            }}
          >
            <UsersRound style={{ width: "16px", height: "16px" }} />
          </div>
          <div
            className={`${styles.progressLine} ${
              currentStep === "payment" ? styles.completed : ""
            }`}
          ></div>
          <div
            className={`${styles.progressStep} ${
              currentStep === "payment" ? styles.active : ""
            }`}
            onClick={() =>
              currentStep === "members-info" &&
              canNavigate("members-info", "payment") &&
              handleNavigateToStep("payment")
            }
            style={{
              cursor:
                currentStep === "members-info" &&
                canNavigate("members-info", "payment")
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            <FileText style={{ width: "16px", height: "16px" }} />
          </div>
        </div>

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          {/* Step 1: Team Name with validations */}
          {currentStep === "team-name" && (
            <div className={styles.formContent}>
              <div className={styles.formGroup}>
                <label htmlFor="teamName">Nama Tim</label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              {/* Validation indicators */}
              <div className={styles.validationContainer}>
                <div className={styles.validationItem}>
                  <div
                    className={`${styles.validationCheckbox} ${
                      teamName.length >= 5 && teamName.length <= 30
                        ? styles.valid
                        : ""
                    }`}
                  ></div>
                  <span>5 - 30 karakter</span>
                </div>
                <div className={styles.validationItem}>
                  <div
                    className={`${styles.validationCheckbox} ${
                      !/[^\w\s]/.test(teamName) ? styles.valid : ""
                    }`}
                  ></div>
                  <span>Tidak ada spesial karakter</span>
                </div>
                <div className={styles.validationItem}>
                  <div
                    className={`${styles.validationCheckbox} ${
                      !/^\d+$/.test(teamName) ? styles.valid : ""
                    }`}
                  ></div>
                  <span>Nama tim tidak boleh dari angka saja</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Team Leader and Members */}
          {currentStep === "members-info" && (
            <>
              {/* Team Leader Section */}
              <div className={styles.memberSection}>
                <div className={styles.memberHeader}>
                  <h3 className={styles.sectionTitle}>Ketua Kelompok</h3>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="leaderName">
                    Nama Lengkap <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="leaderName"
                    value={creatorDetails.fullName}
                    onChange={(e) =>
                      handleCreatorChange("fullName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="leaderEmail">
                    Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="leaderEmail"
                    value={creatorDetails.email}
                    onChange={(e) =>
                      handleCreatorChange("email", e.target.value)
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="leaderDob">
                    Tanggal Lahir <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.dateInput}>
                    <input
                      type="date"
                      id="leaderDob"
                      value={creatorDetails.dateOfBirth}
                      onChange={(e) =>
                        handleCreatorChange("dateOfBirth", e.target.value)
                      }
                      required
                      placeholder="dd/mm/yy"
                    />
                    <svg
                      className={styles.dateIcon}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    Jenis Kelamin <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.radioGroup}>
                    <label
                      className={`${styles.radioBox} ${
                        creatorDetails.gender === "Laki-Laki"
                          ? styles.selected
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="Laki-Laki"
                        checked={creatorDetails.gender === "Laki-Laki"}
                        onChange={(e) =>
                          handleCreatorChange("gender", e.target.value)
                        }
                        required
                      />
                      <span className={styles.customRadio} />
                      Laki - Laki
                    </label>

                    <label
                      className={`${styles.radioBox} ${
                        creatorDetails.gender === "Perempuan"
                          ? styles.selected
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="Perempuan"
                        checked={creatorDetails.gender === "Perempuan"}
                        onChange={(e) =>
                          handleCreatorChange("gender", e.target.value)
                        }
                        required
                      />
                      <span className={styles.customRadio} />
                      Perempuan
                    </label>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="leaderWhatsapp">
                    Nomor WhatsApp <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="leaderWhatsapp"
                    value={creatorDetails.whatsappNumber}
                    onChange={(e) =>
                      handleCreatorChange("whatsappNumber", e.target.value)
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="leaderInstitution">
                    Institusi / Asal Sekolah{" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="leaderInstitution"
                    value={creatorDetails.institution}
                    onChange={(e) =>
                      handleCreatorChange("institution", e.target.value)
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="leaderIdCard">
                    Upload Kartu Mahasiswa / Pelajar{" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.fileUploadContainer}>
                    <input
                      type="file"
                      id="leaderIdCard"
                      accept="image/*"
                      className={styles.fileInput}
                      required
                      ref={leaderFileRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (validateFile(file)) {
                            const previewUrl = URL.createObjectURL(file);
                            handleCreatorChange("idCardUrl", previewUrl);
                            setCreatorDetails((prev) => ({
                              ...prev,
                              idCardUrl: file,
                              idCardPreviewUrl: previewUrl,
                            }));
                          } else {
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                    <label
                      htmlFor="leaderIdCard"
                      className={styles.uploadBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        leaderFileRef.current?.click();
                      }}
                    >
                      <Upload style={{ width: "16px", height: "16px" }} />
                      Add File
                    </label>
                  </div>
                  {creatorDetails.idCardPreviewUrl && (
                    <div className={styles.previewContainer}>
                      <img
                        src={creatorDetails.idCardPreviewUrl}
                        alt="Leader ID Card Preview"
                        className={styles.previewImage}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="leaderTwibbon">
                    Link Instagram Post / Google Drive (Twibbon){" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="leaderTwibbon"
                    value={creatorDetails.twibbonLink || ""}
                    onChange={(e) =>
                      handleCreatorChange("twibbonLink", e.target.value)
                    }
                    required
                  />
                  <div style={{ marginTop: 6 }}>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#fff",
                        fontWeight: 500,
                        textShadow: "0 0 4px #4e9cff, 0 0 2px #000",
                      }}
                    >
                      Twibbon Template:{" "}
                      <a
                        href="https://docs.google.com/document/d/1vr7fmakCXN67JawOgAoohW-d1qcmNdwAU2Vd5zucC5U/edit?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#4e9cff",
                          textDecoration: "underline",
                        }}
                      >
                        Link Twibbon S2C
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              {teamMembers.map((member, index) => (
                <div key={index} className={styles.memberWrapper}>
                  <div className={styles.memberSection}>
                    <div className={styles.memberHeader}>
                      <h3 className={styles.sectionTitle}>
                        Anggota Kelompok {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeMemberField(index)}
                        className={styles.removeMemberButton}
                      >
                        Delete Anggota
                      </button>
                    </div>

                    <div className={styles.formGroup}>
                      <label>
                        Nama Lengkap <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) =>
                          handleMemberChange(index, "fullName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        Email <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) =>
                          handleMemberChange(index, "email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        Tanggal Lahir <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.dateInput}>
                        <input
                          type="date"
                          value={member.dateOfBirth}
                          onChange={(e) =>
                            handleMemberChange(
                              index,
                              "dateOfBirth",
                              e.target.value
                            )
                          }
                          required
                          placeholder="dd/mm/yy"
                        />
                        <svg
                          className={styles.dateIcon}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                            stroke="white"
                            strokeOpacity="0.5"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        Jenis Kelamin <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.radioGroup}>
                        <label
                          className={`${styles.radioBox} ${
                            member.gender === "Laki-Laki" ? styles.selected : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`memberGender-${index}`}
                            value="Laki-Laki"
                            checked={member.gender === "Laki-Laki"}
                            onChange={(e) =>
                              handleMemberChange(
                                index,
                                "gender",
                                e.target.value
                              )
                            }
                            required
                          />
                          <span className={styles.customRadio} />
                          Laki - Laki
                        </label>

                        <label
                          className={`${styles.radioBox} ${
                            member.gender === "Perempuan" ? styles.selected : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`memberGender-${index}`}
                            value="Perempuan"
                            checked={member.gender === "Perempuan"}
                            onChange={(e) =>
                              handleMemberChange(
                                index,
                                "gender",
                                e.target.value
                              )
                            }
                            required
                          />
                          <span className={styles.customRadio} />
                          Perempuan
                        </label>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        Nomor WhatsApp{" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="tel"
                        value={member.whatsappNumber}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "whatsappNumber",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        Institusi / Asal Sekolah{" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        value={member.institution}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        Upload Kartu Mahasiswa / Pelajar{" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.fileUploadContainer}>
                        <input
                          type="file"
                          id={`member${index}IdCard`}
                          accept="image/*"
                          className={styles.fileInput}
                          required
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              if (validateFile(file)) {
                                const previewUrl = URL.createObjectURL(file);

                                const updatedMembers = [...teamMembers];

                                updatedMembers[index] = {
                                  ...updatedMembers[index],
                                  idCardUrl: file,
                                  idCardPreviewUrl: previewUrl,
                                };

                                setTeamMembers(updatedMembers);
                              } else {
                                e.target.value = "";
                              }
                            }
                          }}
                        />
                        <label
                          htmlFor={`member${index}IdCard`}
                          className={styles.uploadBtn}
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(`member${index}IdCard`)
                              ?.click();
                          }}
                        >
                          <Upload style={{ width: "16px", height: "16px" }} />
                          Add File
                        </label>
                      </div>
                      {member.idCardPreviewUrl && (
                        <div className={styles.previewContainer}>
                          <img
                            src={member.idCardPreviewUrl}
                            alt={`Member ${index + 1} ID Card Preview`}
                            className={styles.previewImage}
                          />
                        </div>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        Link Instagram Post / Google Drive (Twibbon){" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        value={member.twibbonLink || ""}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "twibbonLink",
                            e.target.value
                          )
                        }
                        required
                      />
                      <div style={{ marginTop: 6 }}>
                        <span
                          style={{
                            fontSize: 14,
                            color: "#fff",
                            fontWeight: 500,
                            textShadow: "0 0 4px #4e9cff, 0 0 2px #000",
                          }}
                        >
                          Twibbon Template:{" "}
                          <a
                            href="https://docs.google.com/document/d/1vr7fmakCXN67JawOgAoohW-d1qcmNdwAU2Vd5zucC5U/edit?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#4e9cff",
                              textDecoration: "underline",
                            }}
                          >
                            Link Twibbon S2C
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {teamMembers.length < 3 && (
                <button
                  type="button"
                  onClick={addMemberField}
                  className={styles.addMemberButton}
                >
                  Tambah Anggota ({teamMembers.length + 1}/3)
                  <PlusCircle style={{ width: "16px", height: "16px" }} />
                </button>
              )}
            </>
          )}

          {/* Step 4: Payment */}
          {currentStep === "payment" && (
            <>
              <div className={styles.paymentInfo}>
                <p className={styles.paymentAccount}>
                  Silahkan lakukan pembayaran sebesar <span>Rp 100.000,00</span>
                </p>
                <p className={styles.paymentAccount}>
                  ke rekening BCA <span>5726023731</span> A.n. Gusti Ayu Shanti
                  W
                </p>
              </div>

              <div
                className={`${styles.dragDropArea} ${
                  isDragging ? styles.active : ""
                }`}
                onClick={() => paymentFileRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {paymentProofUrl ? (
                  <div className={styles.previewContainer}>
                    <img
                      src={paymentProofUrl}
                      alt="Payment Proof Preview"
                      className={styles.previewImage}
                    />
                    <p>Selected file: {paymentFile?.name}</p>
                  </div>
                ) : (
                  <>
                    <p className={styles.dragDropText}>
                      Drag and drop your file here or click to select from
                      device.
                    </p>
                    <p className={styles.dragDropHint}>
                      Supported file types: .png, .jpg, and other image formats.
                    </p>
                    <p className={styles.dragDropHint}>
                      Maximum file size: 5 MB
                    </p>
                  </>
                )}
                <input
                  type="file"
                  ref={paymentFileRef}
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </div>

              {/* WhatsApp Group Join Section */}
              {paymentProofUrl && (
                <div
                  style={{
                    marginTop: 32,
                    padding: 24,
                    background: "rgba(44, 130, 201, 0.10)",
                    borderRadius: 16,
                    textAlign: "center",
                    boxShadow: "0 2px 16px 0 rgba(44,130,201,0.10)",
                  }}
                >
                  <h3
                    style={{
                      color: "#25D366",
                      fontWeight: 700,
                      fontSize: 22,
                      marginBottom: 8,
                    }}
                  >
                    Join WhatsApp Group!
                  </h3>
                  <p style={{ color: "#fff", fontSize: 15, marginBottom: 18 }}>
                    Setelah mengunggah bukti pembayaran, silakan gabung ke grup
                    WhatsApp peserta Study2Challenge 2025 untuk info
                    selanjutnya.
                  </p>
                  <a
                    href="https://chat.whatsapp.com/L8vVtcAfMC0Lx6dFYrMOiG"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "#25D366",
                      color: "#222",
                      fontWeight: 700,
                      fontSize: 17,
                      padding: "12px 32px",
                      borderRadius: 30,
                      textDecoration: "none",
                      boxShadow: "0 2px 8px 0 #25D36644",
                      transition: "background 0.2s, color 0.2s",
                      marginBottom: 8,
                    }}
                  >
                    Gabung Grup WhatsApp
                  </a>
                </div>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div className={styles.buttonContainer}>
            {currentStep !== "payment" ? (
              <button
                type="button"
                onClick={(e) => goToNextStep(e)}
                className={styles.nextButton}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={styles.nextButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className={styles.spinner}></div>
                ) : (
                  "Daftarkan Tim!"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationPage;
