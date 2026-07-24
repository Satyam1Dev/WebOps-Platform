export class AuthResponseDto {
  accessToken: string;

  refreshToken: string;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
  };
}