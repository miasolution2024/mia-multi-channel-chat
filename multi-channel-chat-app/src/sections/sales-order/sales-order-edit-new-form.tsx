/* eslint-disable @typescript-eslint/no-explicit-any */
import { z as zod } from "zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { Form } from "@/components/hook-form";
import { useBoolean } from "@/hooks/use-boolean";
import { SalesOrder } from "@/models/sales-order/sales-order";
import Button from "@mui/lab/LoadingButton";

import { toast } from "@/components/snackbar";
import { mutate } from "swr";
import { endpoints } from "@/utils/axios";
import { SalesOrderNewEditCustomer } from "./sales-order-new-edit-customer";
import {
  createSalesOrderAsync,
  updateSalesOrderAsync,
} from "@/actions/sales-order";
import { SalesOrderEditDetails } from "./sales-order-edit-detail";

// ----------------------------------------------------------------------

export const NewSalesOrderSchema = zod.object({
  salesOrderDetails: zod.array(
    zod.object({
      orderDetailID: zod.string().optional(),
      productID: zod.string().min(1, { message: "Product ID is required!" }),
      quantity: zod
        .number()
        .min(1, { message: "Quantity must be more than 0" }),
      unitPrice: zod.number().min(1, { message: "Price must be more than 0" }),
      unit: zod.string(),
    })
  ),
  // Not required
  customerID: zod.string(),
  notes: zod.string(),
  discount: zod.number(),
  taxes: zod.number(),
  subtotal: zod.number(),
  totalAmount: zod.number(),
});

// ----------------------------------------------------------------------

export function SalesOrderNewEditForm({
  currentSalesOrder,
}: {
  currentSalesOrder?: SalesOrder;
}) {
  const loadingSend = useBoolean();

  const defaultValues = useMemo(
    () => ({
      discount: currentSalesOrder?.discount || 0,
      subtotal: currentSalesOrder?.subtotal || 0,
      totalAmount: currentSalesOrder?.totalAmount || 0,
      taxes: currentSalesOrder?.taxes || 0,
      customerID: currentSalesOrder?.customerID || "",
      notes: currentSalesOrder?.notes || "",
      salesOrderDetails: currentSalesOrder?.salesOrderDetails || [
        {
          orderDetailID: "",
          productID: "",
          unit: "",
          quantity: 1,
          unitPrice: 0,
          subtotal: 0,
        },
      ],
    }),
    [currentSalesOrder]
  );

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(NewSalesOrderSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      await (currentSalesOrder
        ? updateSalesOrderAsync(currentSalesOrder.orderID, data)
        : createSalesOrderAsync(data));

      toast.success(currentSalesOrder ? "Update success!" : "Create success!");

      mutate(endpoints.salesOrders.list);

      reset();
      loadingSend.onFalse();
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <Form methods={methods}>
      <Card>
        <SalesOrderNewEditCustomer />

        <SalesOrderEditDetails />
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
          {currentSalesOrder ? "Update" : "Create"}
        </Button>
      </Stack>
    </Form>
  );
}
