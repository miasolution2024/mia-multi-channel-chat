import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';
import { FilterCustomerState } from './view/customer-list-view';
import { SxProps } from '@mui/material';

// ----------------------------------------------------------------------

type CustomerTableFiltersResultProps = {
  filters: {
    state: FilterCustomerState;
    setState: (updateState: Partial<FilterCustomerState>) => void;
    onResetState: () => void;
    canReset: boolean;
  };
  onResetPage: () => void;
  totalResults: number;
  sx?: SxProps;
}

// ----------------------------------------------------------------------

export function CustomerTableFiltersResult({ filters, onResetPage, totalResults, sx }: CustomerTableFiltersResultProps) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ customerName: '' });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!filters.state.customerName}>
        <Chip {...chipProps} label={filters.state.customerName} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
