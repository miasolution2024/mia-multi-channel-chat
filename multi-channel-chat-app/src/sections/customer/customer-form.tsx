import { z as zod } from "zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { toast } from "@/components/snackbar";
import { Field, Form } from "@/components/hook-form";
import { Customer } from "@/models/customer/customer";
import { createCustomerAsync, updateCustomerAsync } from "@/actions/customer";
import { mutate } from "swr";
import { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

export const CustomerSchema = zod.object({
  customerName: zod.string().min(1, { message: "Name is required!" }),
  email: zod.string().optional(),
  phone: zod.string().optional(),
  address: zod.string().optional(),
});


type CustomerFormProps = {
  currentCustomer: Customer | null;
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export function CustomerForm({
  currentCustomer,
  open,
  onClose,
}: CustomerFormProps) {

  const defaultValues = useMemo(
    () => ({
      customerName: currentCustomer?.customerName || "",
      email: currentCustomer?.email || "",
      phone: currentCustomer?.phone || "",
      address: currentCustomer?.address || "",
    }),
    [currentCustomer]
  );

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(CustomerSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCustomer) {
      reset(defaultValues);
    } else {
      reset({ customerName: "", email: "", phone: "", address: "" });
    }
  }, [currentCustomer, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    const promise = currentCustomer
      ? updateCustomerAsync(currentCustomer?.customerID, data)
      : createCustomerAsync(data);

    try {
      toast.promise(promise, {
        loading: "Loading...",
        success: currentCustomer ? "Update success!" : "Create success!",
        error: currentCustomer ? "Update error!" : "Create error!",
      });

      await promise;

      onClose();
      
      reset();
      
      mutate(endpoints.customers.list);

    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {currentCustomer ? "Update" : "Create"} Customer
        </DialogTitle>

        <DialogContent>
          <Box
            paddingY={2}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
          >
            <Field.Text name="customerName" label="Full name" />
            <Field.Text name="phone" label="Phone" />
            <Field.Text name="address" label="Address" />
            <Field.Text name="email" label="Email address" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {currentCustomer ? " Update" : "Create"}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
