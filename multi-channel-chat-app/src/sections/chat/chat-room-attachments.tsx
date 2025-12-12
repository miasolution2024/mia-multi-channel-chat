/* eslint-disable @typescript-eslint/no-explicit-any */
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from '@/hooks/use-boolean';

import { FileThumbnail } from '@/components/file-thumbnail';

import { CollapseButton } from './styles';
import { fDateTime } from '@/utils/format-time';

// ----------------------------------------------------------------------

export function ChatRoomAttachments({ attachments }: any) {
  const collapse = useBoolean(true);

  const totalAttachments = attachments.length;

  const renderList = attachments.map((attachment: any, index: number) => (
    <Stack key={attachment.name + index} spacing={1.5} direction="row" alignItems="center">
      <FileThumbnail
        imageView
        file={attachment.preview}
        onDownload={() => console.info('DOWNLOAD')}
        slotProps={{ icon: { width: 24, height: 24 } }}
        sx={{ width: 40, height: 40, bgcolor: 'background.neutral' }}
      />

      <ListItemText
        primary={attachment.name}
        secondary={fDateTime(attachment.createdAt)}
        primaryTypographyProps={{ noWrap: true, typography: 'body2' }}
        secondaryTypographyProps={{
          mt: 0.25,
          noWrap: true,
          component: 'span',
          typography: 'caption',
          color: 'text.disabled',
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
