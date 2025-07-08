import { useFormContext } from "react-hook-form";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useResponsive } from "@/hooks/use-responsive";
import { useBoolean } from "@/hooks/use-boolean";
import { Iconify } from "@/components/iconify";
import { useEffect, useState } from "react";
import { Customer } from "@/models/customer/customer";
import { useGetCustomers } from "@/actions/customer";
import { CustomerAddressListDialog } from "../address/customer-address-list-dialog";

// ----------------------------------------------------------------------

export function SalesOrderNewEditCustomer() {
  const { watch, setValue } = useFormContext();

  const mdUp = useResponsive("up", "md");

  const values = watch();

  const { customerID } = values;

  const customerDialog = useBoolean();

  const { customers } = useGetCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    customers.find((customer) => customer.customerID === customerID) || null
  );

  useEffect(() => {
    setSelectedCustomer(
      customers.find((customer) => customer.customerID === customerID) || null
    );
  }, [customers, customerID]);

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
              Customer:
            </Typography>

            <IconButton onClick={customerDialog.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">
              {selectedCustomer?.customerName}
            </Typography>
            <Typography variant="body2">{selectedCustomer?.address}</Typography>
            <Typography variant="body2"> {selectedCustomer?.phone}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <CustomerAddressListDialog
        title="Customers"
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        selected={(selectedId) => customerID === selectedId}
        onSelect={(address) => {
          setSelectedCustomer(address);
          setValue("customerID", address.customerID);
        }}
        list={customers}
      />
    </>
  );
}
