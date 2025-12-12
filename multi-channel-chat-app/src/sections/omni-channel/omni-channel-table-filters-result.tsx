import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';
import { FilterOmniChannelsState } from './view/omni-channel-list-view';
import { SxProps } from '@mui/material';

// ----------------------------------------------------------------------

type OmniChannelsTableFiltersResultProps = {
  filters: {
    state: FilterOmniChannelsState;
    setState: (updateState: Partial<FilterOmniChannelsState>) => void;
    onResetState: () => void;
    canReset: boolean;
  };
  onResetPage: () => void;
  totalResults: number;
  sx?: SxProps;
}

// ----------------------------------------------------------------------

export function OmniChannelsTableFiltersResult({ filters, onResetPage, totalResults, sx }: OmniChannelsTableFiltersResultProps) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ omnichannelsName: '' });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!filters.state.omnichannelsName}>
        <Chip {...chipProps} label={filters.state.omnichannelsName} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
