import { JwtPayload as JwtDecodePayload } from 'jwt-decode';

// Define a custom type extending JwtPayload
interface CustomJwtPayload extends JwtDecodePayload {
  email: string;
  is_admin: boolean;
  employee_id: number;
  exp: number; // expiration timestamp
}
//export
export type CustomUser = CustomJwtPayload;