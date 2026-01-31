import { Company } from "../auth/user";
import { Common } from "../common";
import { ConversationChannel } from "../conversation/conversations";

export type OmniChannel = Common & {
  page_id: string;
  page_name: string;
  source: ConversationChannel;
  is_enabled: boolean;
  expired_date: Date;
  access_token: string;
  refresh_token: string;
  company_id: Company;
};
