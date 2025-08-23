/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { useBoolean } from '@/hooks/use-boolean';

import { CollapseButton } from './styles';
import { ChatRoomParticipantDialog } from './chat-room-participant-dialog';
import { Participant } from '@/models/participants/participant';

// ----------------------------------------------------------------------

export function ChatRoomGroup({ participants }: { participants: Participant[] }) {
  const collapse = useBoolean(true);

  const [selected, setSelected] = useState<Participant | null>(null);

  const handleOpen = useCallback((participant: Participant) => {
    setSelected(participant);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  const totalParticipants = participants.length;

  const renderList = (
    <>
      {participants.map((participant: Participant) => (
        <ListItemButton key={participant.id} onClick={() => handleOpen(participant)}>
          <Badge
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar alt={participant.participant_name} src={participant.participant_avatar} />
          </Badge>

          <ListItemText
            sx={{ ml: 2 }}
            primary={participant.participant_name}
            primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
            secondaryTypographyProps={{ noWrap: true, component: 'span', typography: 'caption' }}
          />
        </ListItemButton>
      ))}
    </>
  );

  return (
    <>
      <CollapseButton
        selected={collapse.value}
        disabled={!totalParticipants}
        onClick={collapse.onToggle}
      >
        {`In room (${totalParticipants})`}
      </CollapseButton>

      <Collapse in={collapse.value}>{renderList}</Collapse>

      {selected && (
        <ChatRoomParticipantDialog participant={selected} open={!!selected} onClose={handleClose} />
      )}
    </>
  );
}
