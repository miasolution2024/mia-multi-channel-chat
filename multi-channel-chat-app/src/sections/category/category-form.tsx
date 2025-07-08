"use client";

import { useEffect, useMemo } from "react";
import { z as zod } from "zod";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from "@mui/material";
import { createCategoryAsync, updateCategoryAsync } from "@/actions/category";
import { toast } from "@/components/snackbar";
import { mutate } from "swr";
import { endpoints } from "@/utils/axios";
import { Category } from "@/models/category/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Form } from "@/components/hook-form";
// ----------------------------------------------------------------------

type CategoryFormProps = {
  currentCategory: Category | null;
  open: boolean;
  onClose: VoidFunction;
};


 const Categorieschema = zod.object({
  categoryName: zod.string().min(1, { message: "Name is required!" }),
  description: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function CategoryForm({ currentCategory, open, onClose }: CategoryFormProps) {


  const defaultValues = useMemo(
    () => ({
      categoryName: currentCategory?.categoryName || "",
      description: currentCategory?.description || "",
    }),
    [currentCategory]
  );

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(Categorieschema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCategory) {
      reset(defaultValues);
    } else {
      reset({ categoryName: "", description: "" });
    }
  }, [currentCategory, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    const promise = currentCategory
      ? updateCategoryAsync(currentCategory?.categoryID, data)
      : createCategoryAsync(data);

    try {
      toast.promise(promise, {
        loading: "Loading...",
        success: currentCategory ? "Update success!" : "Create success!",
        error: currentCategory ? "Update error!" : "Create error!",
      });

      await promise;

      onClose();
      
      mutate(endpoints.categories.list);

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
        {currentCategory ? "Update" : "Create"} Category
      </DialogTitle>

      <DialogContent>
        <Box
          paddingY={2}
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{ xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
        >
          <Field.Text name="categoryName" label="Category Name" />
          <Field.Text name="description" label="Description" />
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
          {currentCategory ? " Update" : "Create"}
        </Button>
      </DialogActions>
    </Form>
  </Dialog>
  );
}