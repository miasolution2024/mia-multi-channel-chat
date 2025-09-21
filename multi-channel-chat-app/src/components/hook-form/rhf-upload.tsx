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

export function RHFUpload({ name, multiple, helperText, hidePreview, tooltipContent, maxSize, ...other }: any) {
  const { control, setValue, setError, clearErrors } = useFormContext();

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
          // Clear previous errors
          clearErrors(name);
          
          // Check file size if maxSize is provided
          if (maxSize) {
            const oversizedFiles = acceptedFiles.filter((file: File) => file.size > maxSize);
            
            if (oversizedFiles.length > 0) {
              const maxSizeMB = Math.round(maxSize / (1024 * 1024));
              setError(name, {
                type: 'fileSize',
                message: `File "${oversizedFiles[0].name}" vượt quá kích thước cho phép ${maxSizeMB}MB. Vui lòng chọn file khác.`
              });
              return;
            }
          }
          
          const value = multiple
            ? [...field.value, ...acceptedFiles]
            : acceptedFiles;

          setValue(name, value, { shouldValidate: true });
        };

        return (

          <Upload
            {...uploadProps}
            value={field.value}
            onDrop={onDrop}
            hidePreview={hidePreview}
            tooltipContent={tooltipContent}
            {...other}
          />
        );
      }}
    />
  );
}
