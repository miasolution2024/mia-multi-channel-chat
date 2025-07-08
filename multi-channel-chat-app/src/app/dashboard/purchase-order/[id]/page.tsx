/* eslint-disable @typescript-eslint/no-explicit-any */

// ----------------------------------------------------------------------

import { CONFIG } from "@/config-global";
import { PurchaseOrder } from "@/models/purchase-order/purchase-order";
import { PurchaseOrderDetailsView } from "@/sections/purchase-order/view/purchase-order-details-view";
import axiosInstance, { endpoints } from "@/utils/axios";

export const metadata = {
  title: `Purchase Order Details | Dashboard - ${CONFIG.appName}`,
};

export default async function Page({ params }: any) {
  const { id } = params;

  const purchaseOrder = await getPurchaseOrder(id);
  return <PurchaseOrderDetailsView purchaseOrder={purchaseOrder} />;
}

// ----------------------------------------------------------------------

async function getPurchaseOrder(id: string) {
  try {
    const url = id ? `${endpoints.purchaseOrders.list}/${id}` : "";
    const res = await axiosInstance.get(url);

    return res?.data.data as PurchaseOrder;
  } catch (error) {
    console.error("Error during get purchase order:", error);
    throw error;
  }
}
