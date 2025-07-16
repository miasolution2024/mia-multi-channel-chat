export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  email: string;
  location?: string;
  title?: string;
  description?: string;
  tags?: string[];
  languages?: string;
  role?: Role;
  avatar: string;
  status?: string;
  last_access?: Date;
  accessToken?: string;
  policies?: string[];
}

export interface Role {
  id: string;
  name: string;
  icon: string;
  description: string;
  policies: string[];
}
