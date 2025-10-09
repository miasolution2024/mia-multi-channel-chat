/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { formatStr } from "@/utils/format-time";

// ----------------------------------------------------------------------

export function RHFDatePicker({ name, slotProps, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          value={field.value ? dayjs(field.value) : null}
          onChange={(newValue) => field.onChange(newValue ? newValue.toDate() : null)}
          format={formatStr.split.date}
          slotProps={{
            ...slotProps,
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
              ...slotProps?.textField,
            },
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMobileDateTimePicker({ name, slotProps, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MobileDateTimePicker
          {...field}
          value={field.value ? dayjs(field.value) : null}
          onChange={(newValue) => field.onChange(newValue ? newValue.toDate() : null)}
          format={formatStr.split.dateTime}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
              ...slotProps?.textField,
            },
            ...slotProps,
          }}
          {...other}
        />
      )}
    />
  );
}
