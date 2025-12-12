// ----------------------------------------------------------------------

export interface CustomerGroup {
  id: number;
  name: string;
  action: string;
  descriptions: string;
  services: number;
  [key: string]: unknown;
}

export interface CustomerGroupFormData {
  name: string;
  action: string;
  descriptions: string;
  services: number;
}