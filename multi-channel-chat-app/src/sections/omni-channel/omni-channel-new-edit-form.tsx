/* eslint-disable @typescript-eslint/no-explicit-any */
import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";

import { toast } from "@/components/snackbar";
import { Form, Field } from "@/components/hook-form";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/path";
import { endpoints } from "@/utils/axios";
import { mutate } from "swr";
import { OmniChannel } from "@/models/omni-channel/omni-channel";

// ----------------------------------------------------------------------

export const NewOmniChannelSchema = zod.object({
  page_id: zod.string().min(1, { message: "page id is required!" }),
  page_name: zod.string().min(1, { message: "page name is required!" }),
  source: zod.string(),
  is_enabled: zod.boolean(),
  expired_date: zod.date(),
});

// ----------------------------------------------------------------------

export function OmniChannelNewEditForm({
  currentOmniChannel,
}: {
  currentOmniChannel?: OmniChannel;
}) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      page_id: currentOmniChannel?.page_id || "",
      page_name: currentOmniChannel?.page_name || "",
      source: currentOmniChannel?.source || "",
      is_enabled: currentOmniChannel?.is_enabled || false,
      expired_date: currentOmniChannel?.expired_date || new Date(),
    }),
    [currentOmniChannel]
  );

  const methods = useForm({
    resolver: zodResolver(NewOmniChannelSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentOmniChannel) {
      reset(defaultValues);
    }
  }, [currentOmniChannel, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await (currentOmniChannel
      //   ? updateOmniChannelAsync(currentOmniChannel.id, data)
      //   : createOmniChannelAsync(data));

      reset();
      toast.success(currentOmniChannel ? "Update success!" : "Create success!");

      mutate(endpoints.omniChannels.list);

      router.push(paths.dashboard.omniChannels.root);
    } catch (error) {
      console.error(error);
    }
  });

  // const handleRemoveFile = useCallback(
  //   (inputFile: File) => {
  //     const filtered =
  //       values.images &&
  //       values.images?.filter((file: File) => file !== inputFile);
  //     setValue("images", filtered);
  //   },
  //   [setValue, values.images]
  // );

  // const handleRemoveAllFiles = useCallback(() => {
  //   setValue("images", [], { shouldValidate: true });
  // }, [setValue]);

  const renderDetails = (
    <Card>
      <CardHeader
        title="Details"
        subheader="Title, short description, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="page_id" label="Page ID" />

        <Field.Text name="page_name" label="Page Name" />

        <Field.Text name="source" label="Source" />

        <Field.Text name="is_enabled" label="Enabled" />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack
      spacing={3}
      direction="row"
      alignItems="center"
      justifyContent="end"
      flexWrap="wrap"
    >
      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
      >
        {!currentOmniChannel ? "Create omnichannel" : "Save changes"}
      </Button>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ mx: "auto", maxWidth: { xs: 720, xl: 880 } }}
      >
        {renderDetails}

        {renderActions}
      </Stack>
    </Form>
  );
}
