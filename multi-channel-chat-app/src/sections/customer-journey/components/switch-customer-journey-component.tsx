import { Switch } from "@mui/material";
import { CustomerJourney } from "../types";
import { updateCustomerJourney } from "@/actions/customer-journey";
import { useCallback, useState } from "react";
import { toast } from "sonner";
export const SwitchCustomerJourneyComponent = ({
  item,
}: {
  item: CustomerJourney;
}) => {
    const [checked, setChecked] = useState(item.active);

  const handleChangeChecked = useCallback(async (checked: boolean) => {
    setChecked(checked);
    await updateCustomerJourney(item.id, {
      active: checked,
    });
    toast.success("Cập nhật trạng thái thành công");
  }, [item]);

  return (
    <Switch checked={checked} onChange={(e)=> handleChangeChecked(e.target.checked)} />
  );
};
