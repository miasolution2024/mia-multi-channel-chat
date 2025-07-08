import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';
import { FilterCategoryState } from './view/category-list-view';
import { SxProps } from '@mui/material';

// ----------------------------------------------------------------------

type CategoryTableFiltersResultProps = {
  filters: {
    state: FilterCategoryState;
    setState: (updateState: Partial<FilterCategoryState>) => void;
    onResetState: () => void;
    canReset: boolean;
  };
  onResetPage: () => void;
  totalResults: number;
  sx?: SxProps;
}

// ----------------------------------------------------------------------

export function CategoryTableFiltersResult({ filters, onResetPage, totalResults, sx }: CategoryTableFiltersResultProps) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ categoryName: '' });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!filters.state.categoryName}>
        <Chip {...chipProps} label={filters.state.categoryName} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
