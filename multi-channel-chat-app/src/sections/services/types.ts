// ----------------------------------------------------------------------

export interface Services {
  id: number;
  name: string;
  description: string;
  [key: string]: unknown;
}

export interface ServicesFormData {
  name: string;
  description: string;
}