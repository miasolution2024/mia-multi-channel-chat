import { useFormContext } from "react-hook-form";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useResponsive } from "@/hooks/use-responsive";
import { useBoolean } from "@/hooks/use-boolean";
import { Iconify } from "@/components/iconify";
import { SupplierAddressListDialog } from "../address";
import { useGetSuppliers } from "@/actions/supplier";
import { useEffect, useState } from "react";
import { Supplier } from "@/models/supplier/supplier";
import { Field } from "@/components/hook-form";

// ----------------------------------------------------------------------

export function PurchaseOrderNewEditSupplier() {
  const { watch, setValue } = useFormContext();

  const mdUp = useResponsive("up", "md");

  const values = watch();

  const { supplierID } = values;

  const supplierDialog = useBoolean();

  const { suppliers } = useGetSuppliers();

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    suppliers.find((supplier) => supplier.supplierID === supplierID) || null
  );

  useEffect(() => {
    setSelectedSupplier(
      suppliers.find((supplier) => supplier.supplierID === supplierID) || null
    );
  }, [suppliers, supplierID]);

  return (
    <>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: "column", md: "row" }}
        divider={
          mdUp && (
            <Divider
              flexItem
              orientation="vertical"
              sx={{ borderStyle: "dashed" }}
            />
          )
        }
        sx={{ p: 3, mb: { xs: 0, md: 1 } }}
      >
        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="flex-center">
            <Typography
              variant="h6"
              sx={{ color: "text.disabled", flexGrow: 1 }}
            >
              Supplier:
            </Typography>

            <IconButton onClick={supplierDialog.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">
              {selectedSupplier?.supplierName}
            </Typography>
            <Typography variant="body2">{selectedSupplier?.address}</Typography>
            <Typography variant="body2"> {selectedSupplier?.phone}</Typography>
          </Stack>
        </Stack>
        <Stack sx={{ width: 1 }}>
          <Field.Text
            name="notes"
            value={values.notes}
            label="Notes"
            multiline
            rows={4}
          />
        </Stack>
      </Stack>

      <SupplierAddressListDialog
        title="Suppliers"
        open={supplierDialog.value}
        onClose={supplierDialog.onFalse}
        selected={(selectedId) => supplierID === selectedId}
        onSelect={(address) => {
          setSelectedSupplier(address);
          setValue("supplierID", address.supplierID);
        }}
        list={suppliers}
      />
    </>
  );
}
