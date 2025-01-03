import { JwtPayload as JwtDecodePayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtDecodePayload {
  email: string;
  is_admin: boolean;
  employee_id: number;
  exp: number; // expiration timestamp
}
export type CustomUserJwtPayload = CustomJwtPayload;