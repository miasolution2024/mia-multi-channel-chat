import { Common } from "../common";

export enum ParticipantType {
  CUSTOMER = "CUSTOMER",
  STAFF = "STAFF",
  CHATBOT = "CHATBOT",
}

export type Participant = Common & {
  participant_id: string;
  participant_type: ParticipantType;
  participant_name: string;
  participant_email: string;
  conversation?: string;
  participant_phone: string;
  participant_avatar?: string;
  participant_address?: string;
  external_user_id?: string;
  external_user_name?: string;
  status?: string;

};


export type ParticipantCreateRequest = {
  participant_id: string;
  participant_type: ParticipantType;
  participant_name: string;
  participant_email: string;
  participant_phone?: string;
  participant_avatar?: string;
  participant_address?: string;
  external_user_id?: string;
  external_user_name?: string;
  status?: string;
};
