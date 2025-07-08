export interface Session {
  id?: number;
  documentId?: string;
  userID: number;
  accessToken: string;
  email: string;
  userAgent: string;
  redirectURL: string;
  expiredAt: number;
}
