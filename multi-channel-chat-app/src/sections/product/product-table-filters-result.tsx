/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';

// ----------------------------------------------------------------------

export function ProductTableFiltersResult({ filters, onResetPage, totalResults, sx }: any) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveRole = useCallback(
    (inputValue: any) => {
      const newValue = filters.state.role.filter((item: any) => item !== inputValue);

      onResetPage();
      filters.setState({ role: newValue });
    },
    [filters, onResetPage]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Role:" isShow={!!filters.state.role.length}>
        {filters.state.role.map((item: any) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveRole(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
