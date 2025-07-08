/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export function RHFTextField({ name, helperText, type, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === "number" && field.value === 0 ? "" : field.value}
          onChange={(event) => {
            if (type === "number") {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          slotProps={{
            htmlInput: {
              autoComplete: "off",
            },
          }}
          {...other}
        />
      )}
    />
  );
}
