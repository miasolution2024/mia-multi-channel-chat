/* eslint-disable @typescript-eslint/no-explicit-any */
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import ListItemText from "@mui/material/ListItemText";

import { useBoolean } from "@/hooks/use-boolean";

import { FileThumbnail } from "@/components/file-thumbnail";

import { CollapseButton } from "./styles";
import { fDateTime } from "@/utils/format-time";
import { Attachment } from "@/models/message/message";
import { CONFIG } from "@/config-global";

// ----------------------------------------------------------------------

export function ChatRoomAttachments({
  attachments,
}: {
  attachments: Attachment[];
}) {
  const collapse = useBoolean(true);

  const totalAttachments = attachments.length;

  const renderList = attachments.map((attachment: Attachment) => (
    <Stack
      key={attachment.id}
      spacing={1.5}
      direction="row"
      alignItems="center"
    >
      <FileThumbnail
        imageView
        file={`${CONFIG.serverUrl}/assets/${attachment.directus_files_id.id}`}
        onDownload={() => console.info("DOWNLOAD")}
        slotProps={{ icon: { width: 24, height: 24 } }}
        sx={{ width: 40, height: 40, bgcolor: "background.neutral" }}
      />

      <ListItemText
        primary={attachment.directus_files_id.filename_download}
        secondary={fDateTime(attachment.directus_files_id.created_on)}
        primaryTypographyProps={{ noWrap: true, typography: "body2" }}
        secondaryTypographyProps={{
          mt: 0.25,
          noWrap: true,
          component: "span",
          typography: "caption",
          color: "text.disabled",
        }}
      />
    </Stack>
  ));

  return (
    <>
      <CollapseButton
        selected={collapse.value}
        disabled={!totalAttachments}
        onClick={collapse.onToggle}
      >
        {`Attachments (${totalAttachments})`}
      </CollapseButton>

      {!!totalAttachments && (
        <Collapse in={collapse.value}>
          <Stack spacing={2} sx={{ p: 2 }}>
            {renderList}
          </Stack>
        </Collapse>
      )}
    </>
  );
}
