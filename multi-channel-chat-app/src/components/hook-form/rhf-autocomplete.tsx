/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useFormContext } from 'react-hook-form';

import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export function RHFAutocomplete({ 
  name, 
  label, 
  variant, 
  helperText, 
  placeholder, 
  getOptionValue, 
  options, 
  useValueAsId = false,
  ...other 
}: any) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Convert field value (IDs) back to objects for display only if useValueAsId is true
        let displayValue = field.value;
        if (useValueAsId && getOptionValue && field.value && options) {
          if (Array.isArray(field.value)) {
            // For multiple selection, find objects by IDs
            displayValue = field.value.map((id: any) => 
              options.find((option: any) => getOptionValue(option) === id)
            ).filter(Boolean);
          } else {
            // For single selection, find object by ID
            displayValue = options.find((option: any) => getOptionValue(option) === field.value) || null;
          }
        }

        return (
          <Autocomplete
            {...field}
            value={displayValue}
            id={`rhf-autocomplete-${name}`}
            onChange={(event, newValue) => {
              let valueToSet = newValue;
              
              // If useValueAsId and getOptionValue are provided, extract the value
              if (useValueAsId && getOptionValue && newValue) {
                if (Array.isArray(newValue)) {
                  // For multiple selection, map each item to its value
                  valueToSet = newValue.map(item => getOptionValue(item));
                } else {
                  // For single selection, get the value
                  valueToSet = getOptionValue(newValue);
                }
              }
              
              setValue(name, valueToSet, { shouldValidate: true });
            }}
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
            renderTags={(value, getTagProps) =>
              value.map((option: any, index: number) => (
                <Chip
                  {...getTagProps({ index })}
                  key={getOptionValue ? getOptionValue(option) : option}
                  label={other.getOptionLabel ? other.getOptionLabel(option) : option}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: 'primary.lighter',
                    border: 'none',
                    color: 'primary.main',
                  }}
                />
              ))
            }
            options={options || other.options}
            {...other}
          />
        );
      }}
    />
  );
}
