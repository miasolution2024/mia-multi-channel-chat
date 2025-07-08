import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';
import { FilterInventoryTransactionState } from './view/inventory-transaction-list-view';
import { SxProps } from '@mui/material';

// ----------------------------------------------------------------------

type InventoryTransactionTableFiltersResultProps = {
  filters: {
    state: FilterInventoryTransactionState;
    setState: (updateState: Partial<FilterInventoryTransactionState>) => void;
    onResetState: () => void;
    canReset: boolean;
  };
  onResetPage: () => void;
  totalResults: number;
  sx?: SxProps;
}

// ----------------------------------------------------------------------

export function InventoryTransactionTableFiltersResult({ filters, onResetPage, totalResults, sx }: InventoryTransactionTableFiltersResultProps) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ productName: '' });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!filters.state.productName}>
        <Chip {...chipProps} label={filters.state.productName} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
