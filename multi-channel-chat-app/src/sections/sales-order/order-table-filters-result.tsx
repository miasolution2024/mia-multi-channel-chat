import { useCallback } from "react";

import Chip from "@mui/material/Chip";

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from "@/components/filters-result";
import { SxProps } from "@mui/material";
import { FilterSalesOrderState } from "./view/order-list-view";
import { fDateRangeShortLabel } from "@/utils/format-time";
import { SalesOrderStatus } from "@/models/sales-order/sales-order";

// ----------------------------------------------------------------------

type SalesOrderTableFiltersResultProps = {
  filters: {
    state: FilterSalesOrderState;
    setState: (updateState: Partial<FilterSalesOrderState>) => void;
    onResetState: () => void;
    canReset: boolean;
  };
  onResetPage: () => void;
  totalResults: number;
  sx?: SxProps;
};

// ----------------------------------------------------------------------

export function OrderTableFiltersResult({
  filters,
  totalResults,
  onResetPage,
  sx,
}: SalesOrderTableFiltersResultProps) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ customerName: "" });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: SalesOrderStatus.All });
  }, [filters, onResetPage]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    filters.setState({ startDate: null, endDate: null });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={filters.state.status !== SalesOrderStatus.All}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: "capitalize" }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Date:"
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(
            filters.state.startDate,
            filters.state.endDate
          )}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.customerName}>
        <Chip
          {...chipProps}
          label={filters.state.customerName}
          onDelete={handleRemoveKeyword}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
