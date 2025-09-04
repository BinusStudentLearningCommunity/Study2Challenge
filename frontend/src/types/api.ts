export interface EmailBlast {
  _id: string;
  email: string;
  isEmailSent: boolean;
}

export interface EmailBlastResponse {
  success: boolean;
  message: string;
  emailBlast?: EmailBlast;
}

export interface EmailBlastsListResponse {
  success: boolean;
  message: string;
  emailBlasts: EmailBlast[];
}
