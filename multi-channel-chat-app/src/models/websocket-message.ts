/* eslint-disable @typescript-eslint/no-explicit-any */
export type websocketMessage = {
  event: string;
  type: string;
  collection: string;
  status: string;
  data: any[];
};
