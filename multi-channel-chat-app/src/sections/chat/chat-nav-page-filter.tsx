import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

// ----------------------------------------------------------------------

export function ChatPageFilter({
  pages,
  pageId,
  handleChange,
}: {
  pages: {
    id: string;
    page_name: string;
  }[];
  pageId: string;
  handleChange: (event: SelectChangeEvent<string>) => void;
}) {
  return (
    <>
      <Select
        label={null}
        sx={{ width: 300 }}
        value={pageId}
        onChange={handleChange}
      >
        {pages.map((name, index) => (
          <MenuItem key={index} value={name.page_name}>
            <ListItemText primary={name.page_name} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
