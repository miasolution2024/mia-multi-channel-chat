import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { sharedStyles } from "@/components/nav-section";
import { OmniChannel } from "@/models/omni-channel/omni-channel";

// ----------------------------------------------------------------------

export function ChatPageFilter({
  pages,
  pageId,
  handleChange,
}: {
  pages: OmniChannel[];
  pageId: string;
  handleChange: (event: SelectChangeEvent<string>) => void;
}) {
  return (
    <>
      <Select
        sx={{ width: '100%' }}
        value={pageId}
        onChange={handleChange}
      >
        {pages.map((name, index) => (
          <MenuItem key={index} value={name.page_id}>
            <ListItemText
              primary={name.page_name}
              slotProps={{
                primary: {
                  sx: {
                    ...sharedStyles.noWrap,
                  },
                },
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
