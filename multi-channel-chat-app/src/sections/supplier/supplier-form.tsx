"use client";

import { useEffect, useMemo } from "react";
import { z as zod } from "zod";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from "@mui/material";
import { createSupplierAsync, updateSupplierAsync } from "@/actions/supplier";
import { toast } from "@/components/snackbar";
import { mutate } from "swr";
import { endpoints } from "@/utils/axios";
import { Supplier } from "@/models/supplier/supplier";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Form } from "@/components/hook-form";
// ----------------------------------------------------------------------

type SupplierFormProps = {
  currentSupplier: Supplier | null;
  open: boolean;
  onClose: VoidFunction;
};


 const SupplierSchema = zod.object({
  supplierName: zod.string().min(1, { message: "Name is required!" }),
  email: zod.string().optional(),
  description: zod.string().optional(),
  phone: zod.string().optional(),
  address: zod.string().optional(),
  contactPerson: zod.string().optional(),
  salePersonPhone: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function SupplierForm({ currentSupplier, open, onClose }: SupplierFormProps) {


  const defaultValues = useMemo(
    () => ({
      supplierName: currentSupplier?.supplierName || "",
      description: currentSupplier?.description || "",
      email: currentSupplier?.email || "",
      phone: currentSupplier?.phone || "",
      address: currentSupplier?.address || "",
      contactPerson: currentSupplier?.contactPerson || "",
      salePersonPhone: currentSupplier?.salePersonPhone || "",
    }),
    [currentSupplier]
  );

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(SupplierSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentSupplier) {
      reset(defaultValues);
    } else {
      reset({ supplierName: "",description:"", salePersonPhone: "",  email: "", phone: "", address: "", contactPerson: "" });
    }
  }, [currentSupplier, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    const promise = currentSupplier
      ? updateSupplierAsync(currentSupplier?.supplierID, data)
      : createSupplierAsync(data);

    try {
      toast.promise(promise, {
        loading: "Loading...",
        success: currentSupplier ? "Update success!" : "Create success!",
        error: currentSupplier ? "Update error!" : "Create error!",
      });

      await promise;

      onClose();
      
      mutate(endpoints.suppliers.list);

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
        {currentSupplier ? "Update" : "Create"} Supplier
      </DialogTitle>

      <DialogContent>
        <Box
          paddingY={2}
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{ xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
        >
          <Field.Text name="supplierName" label="Supplier name" />
          <Field.Text name="description" label="Description" />
          <Field.Text name="phone" label="Phone" />
          <Field.Text name="address" label="Address" />
          <Field.Text name="email" label="Email address" />
          <Field.Text name="contactPerson" label="Contact person" />
          <Field.Text name="salePersonPhone" label="Sale Person phone" />
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
          {currentSupplier ? " Update" : "Create"}
        </Button>
      </DialogActions>
    </Form>
  </Dialog>
  );
}