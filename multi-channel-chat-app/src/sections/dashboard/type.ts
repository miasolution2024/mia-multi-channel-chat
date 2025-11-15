export interface OmniChoices {
  id: number;
  page_id: string;
  page_name: string;
  token: string;
}

export interface DashboardData {
  id: number;
  omni_channels: number;
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
      value: {
        like: number;
        love: number;
        wow: number;
        haha: number;
        sorry: number;
        anger: number;
      };
    }>;
  }>;
}

export interface DashboardTotalData {
  id: number;
  presentData: number;
  previosData: number;
}

export interface ChartDataPoint {
  x: string;
  y: number;
}

export interface ProcessedPageData {
  pageName: string;
  pageId: string;
  data: ChartDataPoint[];
  color: string;
}

export interface PagePostsData {
  id: number;
  post_title: string;
  omni_name: string;
  dashboard_data: number;
  reactions_count: string;
  shares_count: string;
  views_count: string;
  comments_count: string;
}
