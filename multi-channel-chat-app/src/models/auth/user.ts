export interface UserGroup {
  id: number;
  name: string;
  description: string;
  users: {
    id: number;
    user_groups_id: number;
    directus_users_id: User;
  }[];
  omni_channels: {
    id: number;
    user_groups_id: number;
    omni_channels_id: {
      page_id: string;
      id: number;
      page_name: string;
      source: string;
      sort: number;
    };
  }[];
}
export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
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
  isAdmin?: boolean;
  policies?: string[];
  company_id?: Company;
}

export interface Company {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  icon: string;
  description: string;
  policies: {
    policy: Policy;
  }[];
}

export interface Policy {
  id: string;
  icon: string;
  name: string;
  ip_access: string;
  description: string;
  app_access: boolean;
  admin_access: boolean;
}
