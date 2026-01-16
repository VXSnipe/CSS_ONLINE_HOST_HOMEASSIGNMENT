export type UserRole = 'Salesperson' | 'Store Manager' | 'System Admin';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}
