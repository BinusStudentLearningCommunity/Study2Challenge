import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import { registerTeam, getMyTeam } from '../../features/event/eventService';
import type { RegisterTeamPayload, MemberDetails } from '../../features/event/eventService';

import styles from './EventRegistrationPage.module.css';

const blankMember: MemberDetails = {
    fullName: '', email: '', dateOfBirth: '', gender: '',
    whatsappNumber: '', institution: '', idCardUrl: '', twibbonLink: ''
};

const EventRegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [teamName, setTeamName] = useState('');
    const [paymentProofUrl, setPaymentProofUrl] = useState('');
    const [creatorDetails, setCreatorDetails] = useState({
        fullName: '', email: '', dateOfBirth: '', gender: '', whatsappNumber: '',
        institution: '', idCardUrl: '', twibbonLink: ''
    });
    const [teamMembers, setTeamMembers] = useState<MemberDetails[]>([]);

    useEffect(() => {
        const checkStatusAndPrefill = async () => {
            try {
                await getMyTeam();

                toast.error('You are already registered in a team.');
                navigate('/dashboard');

            } catch {
                console.log("User does not have a team. Displaying registration form.");

                if (user?.name) {
                    setCreatorDetails(prev => ({ ...prev, fullName: user.name, email: user.email }));
                }
                setIsLoading(false);
            }
        };

        checkStatusAndPrefill();
    }, [user, navigate]);

    // Handlers for state changes
    const handleCreatorChange = (field: keyof typeof creatorDetails, value: string) => {
        setCreatorDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleMemberChange = (index: number, field: keyof MemberDetails, value: string) => {
        const updatedMembers = [...teamMembers];
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setTeamMembers(updatedMembers);
    };

    const addMemberField = () => {
        if (teamMembers.length < 2) {
            setTeamMembers([...teamMembers, blankMember]);
        } else {
            toast.error("A team can have a maximum of 3 members.");
        }
    };

    const removeMemberField = (index: number) => {
        setTeamMembers(teamMembers.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const payload: RegisterTeamPayload = { teamName, paymentProofUrl, creatorDetails, teamMembers };

        try {
            const response = await registerTeam(payload) as { message?: string };
            toast.success(response.message || "Team registered successfully!");
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error: unknown) {
            let errorMessage = 'An unexpected error occurred.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const errResponse = (error as { response?: { data?: { message?: string } } }).response;
                if (errResponse?.data?.message) {
                    errorMessage = errResponse.data.message;
                }
            }
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div>Checking your team status...</div>;
    }

    return (
        <div className={styles.container}>
            <Toaster position="bottom-right" />
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>&larr;</button>
                <h1>Team Registration</h1>
            </div>
            <p className={styles.subHeader}>Create your team and fill in the profile details for all members.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <fieldset className={styles.fieldset}>
                    <legend>Team Information</legend>
                    <div className={styles.formGroup}>
                        <label>Team Name <span className={styles.required}>*</span></label>
                        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Payment Proof URL</label>
                        <input type="text" value={paymentProofUrl} onChange={(e) => setPaymentProofUrl(e.target.value)} />
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>Leader's Profile (Your Profile)</legend>
                    {/* Fields for creatorDetails */}
                    <div className={styles.formGroup}>
                       <label>Full Name <span className={styles.required}>*</span></label>
                       <input type="text" value={creatorDetails.fullName} onChange={(e) => handleCreatorChange('fullName', e.target.value)} required/>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email (for info) <span className={styles.required}>*</span></label>
                      <input type="email" value={creatorDetails.email} onChange={(e) => handleCreatorChange('email', e.target.value)} required/>
                  </div>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Date of Birth <span className={styles.required}>*</span></label>
                            <input type="date" value={creatorDetails.dateOfBirth} onChange={(e) => handleCreatorChange('dateOfBirth', e.target.value)} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Gender <span className={styles.required}>*</span></label>
                            <select value={creatorDetails.gender} onChange={(e) => handleCreatorChange('gender', e.target.value)} required>
                                <option value="" disabled>Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>WhatsApp Number <span className={styles.required}>*</span></label>
                        <input type="tel" value={creatorDetails.whatsappNumber} onChange={(e) => handleCreatorChange('whatsappNumber', e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Institution / University <span className={styles.required}>*</span></label>
                        <input type="text" value={creatorDetails.institution} onChange={(e) => handleCreatorChange('institution', e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Student ID Card URL <span className={styles.required}>*</span></label>
                        <input type="text" value={creatorDetails.idCardUrl} onChange={(e) => handleCreatorChange('idCardUrl', e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Twibbon URL</label>
                        <input type="text" value={creatorDetails.twibbonLink} onChange={(e) => handleCreatorChange('twibbonLink', e.target.value)} />
                    </div>
                </fieldset>

                {teamMembers.map((member, index) => (
                    <fieldset key={index} className={styles.fieldset}>
                        <legend>Member #{index + 2} Profile</legend>
                        <button type="button" onClick={() => removeMemberField(index)} className={styles.removeMemberButton}>Remove Member</button>
                        {/* Fields for teamMembers */}
                         <div className={styles.formGroup}>
                            <label>Full Name <span className={styles.required}>*</span></label>
                            <input type="text" value={member.fullName} onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)} required/>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email (for info) <span className={styles.required}>*</span></label>
                            <input type="email" value={member.email} onChange={(e) => handleMemberChange(index, 'email', e.target.value)} required/>
                        </div>
                        <div className={styles.formGrid}>
                           <div className={styles.formGroup}>
                               <label>Date of Birth <span className={styles.required}>*</span></label>
                               <input type="date" value={member.dateOfBirth} onChange={(e) => handleMemberChange(index, 'dateOfBirth', e.target.value)} required />
                           </div>
                           <div className={styles.formGroup}>
                               <label>Gender <span className={styles.required}>*</span></label>
                               <select value={member.gender} onChange={(e) => handleMemberChange(index, 'gender', e.target.value)} required>
                                   <option value="" disabled>Select...</option>
                                   <option value="Male">Male</option>
                                   <option value="Female">Female</option>
                               </select>
                           </div>
                       </div>
                       <div className={styles.formGroup}>
                           <label>WhatsApp Number <span className={styles.required}>*</span></label>
                           <input type="tel" value={member.whatsappNumber} onChange={(e) => handleMemberChange(index, 'whatsappNumber', e.target.value)} required />
                       </div>
                       <div className={styles.formGroup}>
                           <label>Institution / University <span className={styles.required}>*</span></label>
                           <input type="text" value={member.institution} onChange={(e) => handleMemberChange(index, 'institution', e.target.value)} required />
                       </div>
                       <div className={styles.formGroup}>
                           <label>Student ID Card URL <span className={styles.required}>*</span></label>
                           <input type="text" value={member.idCardUrl} onChange={(e) => handleMemberChange(index, 'idCardUrl', e.target.value)} required />
                       </div>
                       <div className={styles.formGroup}>
                           <label>Twibbon URL</label>
                           <input type="text" value={member.twibbonLink} onChange={(e) => handleMemberChange(index, 'twibbonLink', e.target.value)} />
                       </div>
                    </fieldset>
                ))}

                {teamMembers.length < 2 && (
                    <button type="button" onClick={addMemberField} className={styles.addMemberButton}>+ Add Another Member</button>
                )}

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Create & Register Team'}
                </button>
            </form>
        </div>
    );
};

export default EventRegistrationPage;