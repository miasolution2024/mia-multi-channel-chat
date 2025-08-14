import React from "react";
import { useFormContext } from "react-hook-form";
import { Box, TextField, Button, Stack, Divider } from "@mui/material";
import { Iconify } from "@/components/iconify";

interface HtmlEditorProps {
  name?: string;
  placeholder?: string;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({
  name = "post_html_format",
  placeholder = "Nhập nội dung HTML...",
}) => {
  const { watch, setValue } = useFormContext();
  const htmlCode = watch(name) || "";

  const handleChange = (value: string) => {
    setValue(name, value);
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={15}
        value={htmlCode}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: "monospace",
            fontSize: "14px",
            lineHeight: 1.5,
          },
        }}
      />

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="eva:trash-2-outline" />}
          onClick={() => handleChange("")}
        >
          Clear
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="eva:code-outline" />}
          onClick={() => {
            const formatted = htmlCode
              .replace(/></g, ">\n<")
              .replace(/^\s+|\s+$/g, "");
            handleChange(formatted);
          }}
        >
          Format
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="eva:copy-outline" />}
          onClick={() => {
            navigator.clipboard.writeText(htmlCode);
          }}
        >
          Copy
        </Button>
      </Stack>
    </Box>
  );
};

export { HtmlEditor };
export default HtmlEditor;
