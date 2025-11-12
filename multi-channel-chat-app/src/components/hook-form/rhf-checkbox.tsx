/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';

// ----------------------------------------------------------------------

export function RHFCheckbox({ name, helperText, label, slotProps, ...other }: any) {
  const { control } = useFormContext();

  const ariaLabel = `Checkbox ${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={slotProps?.wrap}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                {...slotProps?.checkbox}
                inputProps={{
                  ...(!label && { 'aria-label': ariaLabel }),
                  ...slotProps?.checkbox?.inputProps,
                }}
              />
            }
            label={label}
            {...other}
          />

          {(!!error || helperText) && (
            <FormHelperText
              error={!!error}
              {...slotProps?.formHelperText}
              sx={slotProps?.formHelperText?.sx}
            >
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}