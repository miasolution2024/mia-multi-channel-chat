/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export function RHFTextField({ name, helperText, type, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            fullWidth
            type={type}
            value={field.value ?? ""}
            onChange={(event) => {
              if (type === "number") {
                const value = event.target.value;
                
                if (value === "" || value === null || value === undefined) {
                  field.onChange("");
                } else {
                  const numValue = Number(value);
                  if (!isNaN(numValue)) {
                    field.onChange(numValue);
                  } else {
                    field.onChange(value); // Keep the string value for partial inputs like "1."
                  }
                }
              } else {
                field.onChange(event.target.value);
              }
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
            slotProps={{
              htmlInput: {
                autoComplete: "off",
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}
