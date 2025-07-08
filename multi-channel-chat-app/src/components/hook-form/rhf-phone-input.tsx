/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useFormContext } from "react-hook-form";

import { PhoneInput } from "../phone-input";

// ----------------------------------------------------------------------

export function RHFPhoneInput({ name, helperText, ...other }: any) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PhoneInput
          {...field}
          fullWidth
          value={field.value}
          onChange={(newValue: any) =>
            setValue(name, newValue, { shouldValidate: true })
          }
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
