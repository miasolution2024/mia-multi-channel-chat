/* eslint-disable @typescript-eslint/no-explicit-any */
// ----------------------------------------------------------------------

import { Controller, useFormContext } from "react-hook-form";
import { Upload } from "../upload/upload";
import { UploadAvatar, UploadBox } from "../upload";
import { FormHelperText } from "@mui/material";
import { uploadFiles } from "@/actions/upload";
// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }: any) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = async (acceptedFiles: any) => {
          const value = acceptedFiles[0];
          const response = await uploadFiles([value]);
          setValue(name, response[0].url, { shouldValidate: true });
        };

        return (
          <div>
            <UploadAvatar
              value={field.value}
              error={!!error}
              onDrop={onDrop}
              {...other}
            />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}
// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, hidePreview, ...other }: any) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { "image/*": [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: any) => {
          const value = multiple
            ? [...field.value, ...acceptedFiles]
            : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <Upload
            {...uploadProps}
            value={field.value}
            onDrop={onDrop}
            hidePreview={hidePreview}
            {...other}
          />
        );
      }}
    />
  );
}
