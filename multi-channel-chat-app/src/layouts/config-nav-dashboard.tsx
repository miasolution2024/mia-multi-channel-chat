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
  /**
   * Overview
   */
  {
    subheader: "Overview",
    items: [
      // {
      //   title: "Dashboard",
      //   path: paths.dashboard.root,
      //   icon: ICONS.dashboard,
      // },
      // {
      //   title: "Customer",
      //   path: paths.dashboard.customer.root,
      //   icon: ICONS.user,
      // },
      // {
      //   title: "Category",
      //   path: paths.dashboard.category.root,
      //   icon: ICONS.category,
      // },
      // {
      //   title: "Product",
      //   path: paths.dashboard.product.root,
      //   icon: ICONS.product,
      // },
      // {
      //   title: "Supplier",
      //   path: paths.dashboard.supplier.root,
      //   icon: ICONS.suppier,
      // },
      // {
      //   title: "Purchase Order",
      //   path: paths.dashboard.purchaseOrder.root,
      //   icon: ICONS.order,
      // },
      // {
      //   title: "Sales Order",
      //   path: paths.dashboard.salesOrder.root,
      //   icon: ICONS.invoice,
      // },
      // {
      //   title: "Inventory",
      //   path: paths.dashboard.inventoryTransaction.root,
      //   icon: ICONS.inventory,
      // },
      // {
      //   title: "Chat",
      //   path: paths.dashboard.chat,
      //   icon: ICONS.chat,
      // },
      {
        title: "Trợ lý nội dung",
        path: paths.dashboard.contentAssistant.root,
        icon: ICONS.blog,
      },
      {
        title: "Văn phong AI",
        path: paths.dashboard.contentTone.root,
        icon: ICONS.file,
      },
      {
        title: "Quy tắc AI",
        path: paths.dashboard.aiRules.root,
        icon: ICONS.menuItem,
      },
      {
        title: "Chiến dịch Marketing",
        path: paths.dashboard.marketingCampaign.root,
        icon: ICONS.inventory,
      }
    ],
  },
];
