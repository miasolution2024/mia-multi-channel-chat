// ----------------------------------------------------------------------

import { SvgColor } from "@/components/svg-color";
import { CONFIG } from "@/config-global";
import { paths } from "@/routes/path";

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon("ic-job"),
  blog: icon("ic-blog"),
  chat: icon("ic-chat"),
  mail: icon("ic-mail"),
  user: icon("ic-user"),
  file: icon("ic-file"),
  lock: icon("ic-lock"),
  tour: icon("ic-tour"),
  order: icon("ic-order"),
  label: icon("ic-label"),
  blank: icon("ic-blank"),
  kanban: icon("ic-kanban"),
  folder: icon("ic-folder"),
  course: icon("ic-course"),
  banking: icon("ic-banking"),
  booking: icon("ic-booking"),
  invoice: icon("ic-invoice"),
  product: icon("ic-product"),
  calendar: icon("ic-calendar"),
  disabled: icon("ic-disabled"),
  external: icon("ic-external"),
  menuItem: icon("ic-menu-item"),
  ecommerce: icon("ic-ecommerce"),
  analytics: icon("ic-analytics"),
  dashboard: icon("ic-dashboard"),
  parameter: icon("ic-parameter"),
  suppier: icon("ic-suppier"),
  category: icon("ic-category"),
  inventory: icon("ic-inventory"),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: "Đào tạo AI",
    items: [
      {
        title: "Quy tắc AI",
        path: paths.dashboard.aiRules.root,
        icon: ICONS.menuItem,
      },
      {
        title: "Văn phong AI",
        path: paths.dashboard.contentTone.root,
        icon: ICONS.file,
      },
    ],
  },
  {
    subheader: "Danh mục dịch vụ",
    items: [
      {
        title: "Dịch vụ",
        path: paths.dashboard.service.root,
        icon: ICONS.ecommerce,
      },
    ],
  },
  {
    subheader: "Chiến dịch Marketing",
    items: [
      {
        title: "Quản lý chiến dịch",
        path: paths.dashboard.marketingCampaign.root,
        icon: ICONS.inventory,
      },
      {
        title: "Nhóm khách hàng",
        path: paths.dashboard.customerGroup.root,
        icon: ICONS.banking,
      },
      {
        title: "Giai đoạn khách hàng",
        path: paths.dashboard.customerJourney.root,
        icon: ICONS.suppier,
      },
      {
        title: "Hành trình khách hàng",
        path: paths.dashboard.customerJourneyProcess.root,
        icon: ICONS.category,
      },
      {
        title: "Hành vi khách hàng",
        path: paths.dashboard.customerInsight.root,
        icon: ICONS.user,
      },
      {
        title: "AI đề xuất nội dung",
        path: paths.dashboard.contentAssistant.root,
        icon: ICONS.blog,
      },
      {
        title: "Lên lịch đăng bài",
        path: paths.dashboard.scheduleCalendar.root,
        icon: ICONS.calendar,
      },
    ],
  },
  {
    subheader: "Quản lý trang",
    items: [
      {
        title: "Danh sách trang",
        path: paths.dashboard.omniChannel.root,
        icon: ICONS.menuItem,
      },
    ],
  },
];
