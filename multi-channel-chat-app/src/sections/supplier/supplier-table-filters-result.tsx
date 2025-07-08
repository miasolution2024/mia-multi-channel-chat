import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';
import { FilterSupplierState } from './view/supplier-list-view';
import { SxProps } from '@mui/material';

// ----------------------------------------------------------------------

type SupplierTableFiltersResultProps = {
  filters: {
    state: FilterSupplierState;
    setState: (updateState: Partial<FilterSupplierState>) => void;
    onResetState: () => void;
    canReset: boolean;
  };
  onResetPage: () => void;
  totalResults: number;
  sx?: SxProps;
}

// ----------------------------------------------------------------------

export function SupplierTableFiltersResult({ filters, onResetPage, totalResults, sx }: SupplierTableFiltersResultProps) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ supplierName: '' });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!filters.state.supplierName}>
        <Chip {...chipProps} label={filters.state.supplierName} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
