import { Metadata } from "next";
import ServiceNewView from "@/sections/service/view/service-new-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Tạo Dịch vụ/Sản phẩm mới",
};

export default function ServiceNewPage() {
  return <ServiceNewView />;
}
