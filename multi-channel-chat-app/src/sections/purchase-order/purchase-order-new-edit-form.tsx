/* eslint-disable @typescript-eslint/no-explicit-any */
import { z as zod } from "zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { Form, schemaHelper } from "@/components/hook-form";
import { useRouter } from "next/navigation";
import { useBoolean } from "@/hooks/use-boolean";
import { today } from "@/utils/format-time";
import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from "@/models/purchase-order/purchase-order";
import { paths } from "@/routes/path";
import { PurchaseOrderNewEditSupplier } from "./purchase-order-new-edit-supllier";
import { PurchaseOrderNewEditStatusDate } from "./purchase-order-new-edit-status-date";
import { PurchaseOrderNewEditDetails } from "./purchase-order-new-edit-details";
import Button from "@mui/lab/LoadingButton";
import {
  createPurchaseOrderAsync,
  updatePurchaseOrderAsync,
} from "@/actions/purchase-order";
import { toast } from "@/components/snackbar";
import { mutate } from "swr";
import { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

export const NewPurchaseOrderSchema = zod.object({
  supplierID: zod.string().min(1, { message: "Product ID is required!" }),
  purchaseOrderDate: schemaHelper.date({
    message: { required_error: "Purchase order date is required!" },
  }),
  purchaseOrderDetails: zod.array(
    zod.object({
      purchaseOrderDetailID: zod.string().optional(),
      productID: zod.string().min(1, { message: "Product ID is required!" }),
      quantity: zod
        .number()
        .min(1, { message: "Quantity must be more than 0" }),
      purchasePrice: zod
        .number()
        .min(1, { message: "Price must be more than 0" }),
      // Not required
      unit: zod.string(),
      subtotal: zod.number(),
    })
  ),
  // Not required
  orderStatus: zod.string(),
  invoiceID: zod.string(),
  notes: zod.string(),
  discount: zod.number(),
  taxes: zod.number(),
  subtotal: zod.number(),
  totalAmount: zod.number(),
});

// ----------------------------------------------------------------------

export function PurchaseOrderNewEditForm({
  currentPurchaseOrder,
}: {
  currentPurchaseOrder?: PurchaseOrder;
}) {
  
  const router = useRouter();

  const loadingSend = useBoolean();

  const defaultValues = useMemo(
    () => ({
      invoiceID: currentPurchaseOrder?.invoiceID || "",
      purchaseOrderDate: currentPurchaseOrder?.purchaseOrderDate || today(),
      orderStatus:
        currentPurchaseOrder?.orderStatus || PurchaseOrderStatus.DRAFT,
      discount: currentPurchaseOrder?.discount || 0,
      subtotal: currentPurchaseOrder?.subtotal || 0,
      totalAmount: currentPurchaseOrder?.totalAmount || 0,
      taxes: currentPurchaseOrder?.taxes || 0,
      supplierID: currentPurchaseOrder?.supplierID || "",
      notes: currentPurchaseOrder?.notes || "",
      purchaseOrderDetails: currentPurchaseOrder?.purchaseOrderDetails || [
        {
          productID: "",
          unit: "",
          quantity: 1,
          purchasePrice: 0,
          subtotal: 0,
          purchaseOrderDetailID: "",
        },
      ],
    }),
    [currentPurchaseOrder]
  );

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(NewPurchaseOrderSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting},
  } = methods;


  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      await (currentPurchaseOrder
        ? updatePurchaseOrderAsync(currentPurchaseOrder.purchaseOrderID, data)
        : createPurchaseOrderAsync(data));

      toast.success(
        currentPurchaseOrder ? "Update success!" : "Create success!"
      );

      mutate(endpoints.purchaseOrders.list);

      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.purchaseOrder.root);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <Form methods={methods}>
      <Card>
        <PurchaseOrderNewEditSupplier />

        <PurchaseOrderNewEditStatusDate />

        <PurchaseOrderNewEditDetails />
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <Button
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentPurchaseOrder ? "Update" : "Create"}
        </Button>
      </Stack>
    </Form>
  );
}
