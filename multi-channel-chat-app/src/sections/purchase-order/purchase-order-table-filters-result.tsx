import { useCallback } from 'react';

import Chip from '@mui/material/Chip';
import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';
import { fDateRangeShortLabel } from '@/utils/format-time';
import { FilterPurchaseOrderState } from './view/purchase-order-list-view';
import { SxProps } from '@mui/material';

// ----------------------------------------------------------------------

type PurchaseOrderTableFiltersResultProps = {
  filters: {
    state: FilterPurchaseOrderState;
    setState: (updateState: Partial<FilterPurchaseOrderState>) => void;
    onResetState: () => void;
    canReset: boolean;
  };
  onResetPage: () => void;
  totalResults: number;
  sx?: SxProps;
}

// ----------------------------------------------------------------------

export function PurchaseOrderTableFiltersResult({ filters, totalResults, onResetPage, sx }: PurchaseOrderTableFiltersResultProps) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ supplierName: '' });
  }, [filters, onResetPage]);


  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    filters.setState({ startDate: null, endDate: null });
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Date:"
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(filters.state.startDate, filters.state.endDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.supplierName}>
        <Chip {...chipProps} label={filters.state.supplierName} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
