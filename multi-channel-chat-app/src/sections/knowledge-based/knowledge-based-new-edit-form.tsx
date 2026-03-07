"use client";

import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

import { Card, Stack, Button, CardHeader, MenuItem } from "@mui/material";

import { paths } from "@/routes/path";
import { useBoolean } from "@/hooks/use-boolean";
import { toast } from "@/components/snackbar";
import { Form, RHFTextField, RHFSelect } from "@/components/hook-form";
import {
  createKnowledgeBased,
  updateKnowledgeBased,
} from "@/actions/knowledge-based";

import {
  KnowledgeBased,
  KnowledgeBasedFormData,
  STATUS_OPTIONS,
} from "./types";

// ----------------------------------------------------------------------

type Props = {
  currentItem?: KnowledgeBased;
};

const NewKnowledgeBasedSchema = zod.object({
  content: zod.string().min(1, "Nội dung là bắt buộc"),
  status: zod.enum(["PUBLISHED", "DRAFT", "SUSPENDED"]),
});

export function KnowledgeBasedNewEditForm({ currentItem }: Props) {
  const router = useRouter();
  const loadingSave = useBoolean();

  const defaultValues = useMemo(
    () => ({
      content: currentItem?.content || "",
      status: currentItem?.status || ("DRAFT" as const),
    }),
    [currentItem],
  );

  const methods = useForm<KnowledgeBasedFormData>({
    resolver: zodResolver(NewKnowledgeBasedSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      if (currentItem) {
        await updateKnowledgeBased(currentItem.id, data);
      } else {
        await createKnowledgeBased(data);
      }

      reset();
      toast.success(
        currentItem ? "Cập nhật thành công!" : "Tạo mới thành công!",
      );
      router.push(paths.dashboard.knowledgeBased.root);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.knowledgeBased.root);
  }, [router]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={currentItem ? "Chỉnh sửa kiến thức" : "Tạo kiến thức mới"}
          subheader="Nhập thông tin kiến thức AI"
        />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="content"
            label="Nội dung"
            multiline
            rows={14}
            placeholder="Nhập nội dung kiến thức..."
          />

          <RHFSelect name="status" label="Trạng thái" required>
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>

        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-end"
          sx={{ p: 3, pt: 0 }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            {currentItem ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
