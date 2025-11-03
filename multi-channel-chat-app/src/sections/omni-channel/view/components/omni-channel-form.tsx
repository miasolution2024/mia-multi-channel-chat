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
import {
  Form,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from "@/components/hook-form";
import { OmniChannel, OmniChannelCreateData } from "../../types";
import { createOmniChannel, updateOmniChannel } from "@/actions/omni-channels";

// ----------------------------------------------------------------------

type Props = {
  omniChannel?: OmniChannel;
};

const OmniChannelSchema = zod.object({
  page_name: zod.string().min(1, "Tên trang là bắt buộc"),
  page_id: zod.string().min(1, "Page ID là bắt buộc"),
  source: zod.string().min(1, "Nguồn là bắt buộc"),
  phone_number: zod.string(),
  token: zod.string().min(1, "Token là bắt buộc"),
  is_enabled: zod.boolean(),
  is_enabled_reply_comment: zod.boolean(),
});

export function OmniChannelForm({ omniChannel }: Props) {
  const router = useRouter();
  const loadingSave = useBoolean();

  const defaultValues = useMemo(
    () => ({
      page_name: omniChannel?.page_name || "",
      page_id: omniChannel?.page_id || "",
      source: omniChannel?.source || "Facebook",
      phone_number: omniChannel?.phone_number || "",
      token: omniChannel?.token || "",
      is_enabled: omniChannel?.is_enabled ?? true,
      is_enabled_reply_comment: omniChannel?.is_enabled_reply_comment ?? true,
    }),
    [omniChannel]
  );

  const methods = useForm<OmniChannelCreateData>({
    resolver: zodResolver(OmniChannelSchema),
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
      if (omniChannel && omniChannel.id) {
        await updateOmniChannel(omniChannel.id, data);
      } else {
        await createOmniChannel(data);
      }

      reset();
      toast.success(
        omniChannel ? "Cập nhật trang thành công!" : "Tạo trang mới thành công!"
      );
      router.push(paths.dashboard.omniChannel.root);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.omniChannel.root);
  }, [router]);

  const sourceOptions = useMemo(
    () => [
      { value: "Facebook", label: "Facebook" },
      { value: "Zalo", label: "Zalo" },
      { value: "Tiktok", label: "Tiktok" },
      { value: "Website", label: "Website" },
      { value: "Instagram", label: "Instagram" },
      { value: "whatsapp", label: "WhatsApp" },
    ],
    []
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader title={omniChannel ? "Chỉnh sửa trang" : "Tạo trang mới"} />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={2} direction={"row"}>
            <RHFTextField
              name="page_id"
              label="Page ID"
              placeholder="Nhập Page ID..."
            />
            <RHFSelect name="source" label="Nguồn" placeholder="Nhập nguồn...">
              {sourceOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <RHFTextField
            name="token"
            label="Mã xác thực"
            placeholder="Nhập mã xác thực..."
          />
          <RHFTextField
            name="page_name"
            label="Tên trang"
            placeholder="Nhập tên trang..."
          />

          <RHFTextField
            name="phone_number"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại..."
          />
          <Stack spacing={2} direction={"row"}>
            <RHFSwitch name="is_enabled" label="Trạng thái" />
            <RHFSwitch
              name="is_enabled_reply_comment"
              label="Tự động trả lời bình luận"
            />
          </Stack>
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
            {omniChannel ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
