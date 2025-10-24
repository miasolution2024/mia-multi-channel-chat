export interface OmniChoices {
  id: number;
  page_id: string;
  page_name: string;
  token: string;
}

export interface FacebookView {
  data: Array<{
    values: Array<{
      value: number;
    }>;
  }>;
}

export interface FacebookReaction {
  data: Array<{
    values: Array<{
      value: Array<{
        like: number;
        love: number;
        wow: number;
        haha: number;
        sad: number;
        angry: number;
      }>;
    }>;
  }>;
}
