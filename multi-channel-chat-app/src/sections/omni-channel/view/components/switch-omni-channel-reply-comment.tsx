import { Switch } from "@mui/material";
import { OmniChannel } from "@/sections/omni-channel/types";
import { updateOmniChannel } from "@/actions/omni-channels";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const SwitchOmniChannelReplyComment = ({ item }: { item: OmniChannel }) => {
  const [checked, setChecked] = useState(item.is_enabled_reply_comment);

  const handleChangeChecked = useCallback(async (newChecked: boolean) => {
    if (item.id === undefined) return;
    setChecked(newChecked);
    try {
      await updateOmniChannel(item.id, {
        is_enabled_reply_comment: newChecked,
      });
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Cập nhật trạng thái thất bại");
      // Revert state on failure
      setChecked(!newChecked);
    }
  }, [item.id]);

  return (
    <Switch checked={checked} onChange={(e) => handleChangeChecked(e.target.checked)} />
  );
};