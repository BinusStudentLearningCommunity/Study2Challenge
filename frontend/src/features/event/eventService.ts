import apiClient from '../../services/apiClient';

export interface Team {
  _id: string;
  teamCode: string;
  teamName: string;
  paymentProofUrl?: string;
  isPay: boolean;
  isLock: boolean;
  isQualified: boolean;
}

export interface Member {
  _id: string;
  teamId: string;
  fullName?: string;
  email: string;
  dateOfBirth?: Date;
  gender?: string;
  whatsappNumber?: string;
  institution?: string;
  idCardUrl?: string;
  twibbonLink?: string;
  role?: string;
}

export interface MyTeamResponse {
  team: Team;
  members: Member[];
}

export const getMyTeam = async (): Promise<MyTeamResponse> => {
  const response = await apiClient.get<MyTeamResponse>('/event/mine');
  return response.data;
};

export const joinTeamByCode = async (teamCode: string) => {
  const response = await apiClient.post('/event/join', { teamCode });
  return response.data;
};
export interface MemberDetails {
    fullName: string;
    email: string; // Informational only
    dateOfBirth: string;
    gender: string;
    whatsappNumber: string;
    institution: string;
    idCardUrl: string;
    twibbonLink?: string;
}

export interface RegisterTeamPayload {
  teamName: string;
  paymentProofUrl?: string;
  creatorDetails: MemberDetails;
  teamMembers: MemberDetails[];
}

export const registerTeam = async (data: RegisterTeamPayload) => {
  const response = await apiClient.post('/event/register', data);
  return response.data;
};