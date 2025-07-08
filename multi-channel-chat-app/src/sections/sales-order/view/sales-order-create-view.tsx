"use client";

import { DashboardContent } from "@/layouts/dashboard";
import { SalesOrderNewEditForm } from "../sales-order-edit-new-form";

// ----------------------------------------------------------------------

export function SalesOrderCreateView() {
  return (
    <DashboardContent>
      <SalesOrderNewEditForm />
    </DashboardContent>
  );
}
