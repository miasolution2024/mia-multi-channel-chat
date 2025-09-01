import { Common } from "../common";

export type Customer = Common & {
  id: string;
  name: string;
  gender: string;
  phone_number: string;
  email: string;
  status: string;
  customer_source: string;
  address: string;
  chatbot_response: boolean;
}

export interface CustomerRequest {
  customerName: string;
  address?: string;
  phone?: string;
  email?: string;
}
