/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export function RHFAutocomplete({ name, label, variant, helperText, placeholder, ...other }: any) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          id={`rhf-autocomplete-${name}`}
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              variant={variant}
              error={!!error}
              helperText={error ? error?.message : helperText}
              slotProps ={{
                htmlInput: {
                  ...params.inputProps,
                  autoComplete: 'new-password',
                },
              }}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
