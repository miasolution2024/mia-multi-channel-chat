/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDropzone } from "react-dropzone";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";

import { Iconify } from "../iconify";
import { uploadClasses } from "./classes";
import { UploadPlaceholder } from "./components/placeholder";
import { RejectionFiles } from "./components/rejection-files";
import { MultiFilePreview } from "./components/preview-multi-file";
import {
  DeleteButton,
  SingleFilePreview,
} from "./components/preview-single-file";
import { varAlpha } from "@/theme/styles";

// ----------------------------------------------------------------------

export function Upload({
  sx,
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  thumbnail,
  helperText,
  onRemoveAll,
  className,
  multiple = false,
  ...other
}: any) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const isArray = Array.isArray(value) && multiple;

  const hasFile = !isArray && !!value;

  const hasFiles = isArray && !!value.length;

  const hasError = isDragReject || !!error;

  const renderMultiPreview = hasFiles && (
    <>
      <MultiFilePreview
        files={value}
        thumbnail={thumbnail}
        onRemove={onRemove}
        sx={{ my: 3 }}
      />

      {(onRemoveAll || onUpload) && (
        <Box gap={1.5} display="flex" justifyContent="flex-end">
          {onRemoveAll && (
            <Button
              color="inherit"
              variant="outlined"
              size="small"
              onClick={onRemoveAll}
            >
              Remove all
            </Button>
          )}

          {onUpload && (
            <Button
              size="small"
              variant="contained"
              onClick={onUpload}
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            >
              Upload
            </Button>
          )}
        </Box>
      )}
    </>
  );

  return (
    <Box
      className={uploadClasses.upload.concat(className ? ` ${className}` : "")}
      sx={{ width: 1, position: "relative", ...sx }}
    >
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: "none",
          borderRadius: 1,
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          bgcolor: (theme: any) =>
            varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
          border: (theme: any) =>
            `1px dashed ${varAlpha(
              theme.vars.palette.grey["500Channel"],
              0.2
            )}`,
          transition: (theme) =>
            theme.transitions.create(["opacity", "padding"]),
          "&:hover": { opacity: 0.72 },
          ...(isDragActive && { opacity: 0.72 }),
          ...(disabled && { opacity: 0.48, pointerEvents: "none" }),
          ...(hasError && {
            color: "error.main",
            borderColor: "error.main",
            bgcolor: (theme: any) =>
              varAlpha(theme.vars.palette.error.mainChannel, 0.08),
          }),
          ...(hasFile && { padding: "28% 0" }),
        }}
      >
        <input {...getInputProps()} />

        {/* Single file */}
        {hasFile ? <SingleFilePreview file={value} /> : <UploadPlaceholder />}
      </Box>

      {/* Single file */}
      {hasFile && <DeleteButton onClick={onDelete} />}

      {helperText && (
        <FormHelperText error={!!error} sx={{ px: 2 }}>
          {helperText}
        </FormHelperText>
      )}

      <RejectionFiles files={fileRejections} />

      {/* Multi files */}
      {renderMultiPreview}
    </Box>
  );
}
