"use client";

import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  Stack,
  Button,
  Autocomplete,
  TextField,
  Chip,
  Box,
  Typography,
  Paper,
} from "@mui/material";

import { paths } from "@/routes/path";
import { useBoolean } from "@/hooks/use-boolean";
import { toast } from "@/components/snackbar";
import { Form, RHFTextField, RHFUpload } from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { Service, ServiceFormData } from "../types";
import { createService, updateService } from "@/actions/service";
import { useGetOmniChannels } from "@/hooks/apis/use-get-omni-channels";
import { CONFIG } from "@/config-global";
import { uploadFile } from "@/actions/upload";

// ----------------------------------------------------------------------

type Props = {
  service?: Service;
};

type FileWithPreview = File & {
  preview?: string;
};

const ServiceSchema = zod.object({
  name: zod.string().min(1, "Tên dịch vụ là bắt buộc"),
  description: zod.string().optional(),
  price: zod
    .number({ message: "Giá phải là số" })
    .min(0, "Giá dịch vụ là bắt buộc"),
  duration: zod
    .number({ message: "Thời lượng phải là số" })
    .min(0, "Thời lượng phải lớn hơn hoặc bằng 0"),
  note: zod.string().optional(),
  omni_channels: zod.array(zod.number()).optional(),
  file_training: zod.array(zod.union([zod.string(), zod.any()])).default([]),
});

export function ServiceForm({ service }: Props) {
  const router = useRouter();
  const loadingSave = useBoolean();

  // Get omni channels for selection
  const { data: omniChannels, isLoading: omniChannelsLoading } =
    useGetOmniChannels({
      limit: 1000,
    });

  const defaultValues = useMemo(
    () => ({
      name: service?.name || "",
      description: service?.description || "",
      price: service?.price ? Number(service.price) : 0,
      duration: service?.duration || 0,
      note: service?.note || "",
      omni_channels:
        service?.omni_channels
          ?.map((channel) => channel.omni_channels_id?.id)
          .filter(Boolean) || [],
      file_training: service?.file_training && service.file_training.length > 0 
        ? [service.file_training[0].directus_files_id] 
        : [],
    }),
    [service]
  );

  const methods = useForm<ServiceFormData>({
    resolver: zodResolver(ServiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const watchedOmniChannels = watch("omni_channels") || [];

  const handleUploadVideo = useCallback(
    async (video: (string | File)[]) => {
     let videoId = null;
       if (Array.isArray(video) && video.length > 0) {
         const videoFile = video[0];  
         if (videoFile instanceof File) {
           const videoUploadResult = await uploadFile(videoFile);
           videoId = videoUploadResult.data.id;
         } else if (typeof videoFile === 'string') {
           videoId = videoFile;
         }
       }
       return videoId;
    },
    []
  );

  const onSubmit = handleSubmit(async (data) => {
    loadingSave.onTrue();
    const fileTrainingId = await handleUploadVideo(data.file_training);
    try {
      if (service) {
        // Handle file_training: delete existing and create new if video changed
        const fileTrainingPayload: {
          create: Array<{ services_id: string; directus_files_id: { id: string } }>;
          update: Array<unknown>;
          delete: Array<number>;
        } = {
          create: [],
          update: [],
          delete: [],
        };

        // If there's an existing video, add its junction table ID to delete array
        if (service.file_training && service.file_training.length > 0) {
          fileTrainingPayload.delete.push(service.file_training[0].id);
        }

        // If there's a new video, add it to create array
        if (fileTrainingId) {
          fileTrainingPayload.create.push({
            services_id: service.id.toString(),
            directus_files_id: { id: fileTrainingId },
          });
        }

        // Handle omni_channels: compare existing vs new
        const existingChannelIds = service?.omni_channels
          ?.map((channel) => channel.omni_channels_id?.id)
          .filter((id): id is number => id !== undefined) || [];
        
        const newChannelIds = data.omni_channels || [];

        // Find channels to delete (junction table IDs of channels that exist but not in new selection)
        const channelsToDelete = service?.omni_channels
          ?.filter((channel) => 
            channel.omni_channels_id?.id && 
            !newChannelIds.includes(channel.omni_channels_id.id)
          )
          .map((channel) => channel.id) || [];

        // Find channels to create (in new but not in existing)
        const channelsToCreate = newChannelIds.filter(
          (id) => !existingChannelIds.includes(id)
        );

        const omniChannelsPayload = {
          create: channelsToCreate.map((channelId: number) => ({
            services_id: service.id.toString(),
            omni_channels_id: { id: channelId },
          })),
          update: [],
          delete: channelsToDelete,
        };

        const updateData = {
          ...data,
          file_training: fileTrainingPayload,
          omni_channels: omniChannelsPayload,
        };

        await updateService(
          service.id,
          updateData as unknown as Partial<ServiceFormData>
        );
      } else {
        const createPayload = {
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          note: data.note,
          file_training: {
            create: [{
              services_id: "+",
              directus_files_id: { id: fileTrainingId },
            }],
            update: [],
            delete: [],
          },
          omni_channels: {
            create:
              data.omni_channels?.map((channelId: number) => ({
                services_id: "+",
                omni_channels_id: { id: channelId },
              })) || [],
            update: [],
            delete: [],
          },
        };
        await createService(createPayload as unknown as ServiceFormData);
      }

      reset();
      toast.success(
        service ? "Cập nhật dịch vụ thành công!" : "Tạo dịch vụ mới thành công!"
      );
      router.push(paths.dashboard.service.root);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.service.root);
  }, [router]);

  const handleOmniChannelsChange = useCallback(
    (event: React.SyntheticEvent, newValue: typeof omniChannels) => {
      const channelIds = newValue.map((channel) => channel.id);
      setValue("omni_channels", channelIds);
    },
    [setValue]
  );

  const selectedOmniChannels = omniChannels.filter((channel) =>
    watchedOmniChannels.includes(channel.id)
  );

  const fileTrainingValue = watch("file_training");
  console.log('fileTrainingValue',fileTrainingValue)

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="name"
            label="Tên dịch vụ"
            placeholder="Nhập tên dịch vụ..."
            required
          />

          <RHFTextField
            name="description"
            label="Mô tả dịch vụ"
            multiline
            rows={4}
            placeholder="Nhập mô tả dịch vụ..."
          />

          <RHFTextField
            name="price"
            type="number"
            label="Giá dịch vụ"
            placeholder="Nhập giá dịch vụ..."
          />

          <RHFTextField
            name="duration"
            label="Thời lượng (phút)"
            type="number"
            placeholder="Nhập thời lượng..."
          />

          <RHFTextField
            name="note"
            label="Ghi chú"
            multiline
            rows={3}
            placeholder="Nhập ghi chú..."
          />

          <Autocomplete
            multiple
            options={omniChannels}
            value={selectedOmniChannels}
            onChange={handleOmniChannelsChange}
            getOptionLabel={(option) => option.page_name || option.source || ""}
            loading={omniChannelsLoading}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.page_name || option.source}
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Kênh Omni"
                placeholder="Chọn kênh omni..."
              />
            )}
          />

          <Box>
            <Typography variant="body2">File training</Typography>
            <RHFUpload
              name="file_training"
              maxFiles={1}
              maxSize={25 * 1024 * 1024} // 25MB in bytes
              accept={{
                "video/*": [".mp4", ".avi", ".mov"],
              }}
              helperText="Định dạng hỗ trợ: MP4, AVI, MOV. Kích thước tối đa: 25MB"
              hidePreview
            />

            {Array.isArray(fileTrainingValue) &&
              fileTrainingValue.length > 0 && (
                <Paper sx={{ p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Video đã chọn
                  </Typography>
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <video
                      src={
                        typeof fileTrainingValue[0] === "string"
                          ? `${CONFIG.serverUrl}/assets/${fileTrainingValue[0]}`
                          : fileTrainingValue?.[0] instanceof File
                          ? (fileTrainingValue[0] as FileWithPreview).preview ||
                            URL.createObjectURL(fileTrainingValue[0])
                          : ""
                      }
                      controls
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setValue("file_training", [])}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        minWidth: "auto",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 1)",
                        },
                      }}
                    >
                      <Iconify icon="mingcute:close-line" width={16} />
                    </Button>
                  </Box>
                </Paper>
              )}
          </Box>
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
            {service ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
