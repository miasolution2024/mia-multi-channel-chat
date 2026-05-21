'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { Iconify } from '@/components/iconify';
import { Conversation } from '@/models/conversation/conversations';
import { ParticipantType } from '@/models/participants/participant';
import { useGetCustomerById } from '@/actions/customer';

// ----------------------------------------------------------------------

type Props = {
  conversation: Conversation;
  onUseSuggestion: (text: string) => void;
};

export function ChatAiSuggestion({ conversation, onUseSuggestion }: Props) {
  const { messages = [], participants = [] } = conversation;

  const customerParticipant = participants.find(
    (p) => p.participant_type === ParticipantType.CUSTOMER
  );
  const { customer } = useGetCustomerById(customerParticipant?.participant_id);

  useEffect(() => {
    if (customer) {
      console.log(`chatbot_response (customer.id=${customer.id}) = ${customer.chatbot_response}`);
    }
  }, [customer]);

  const lastMessage = messages[messages.length - 1];
  const lastIsCustomer = lastMessage?.sender_type === ParticipantType.CUSTOMER;
  const aiSuggestion = lastMessage?.ai_reply_message_suggestion;

  const showSuggestion = !!aiSuggestion && lastIsCustomer;

  if (!showSuggestion) return null;

  return (
    <Box
      sx={{
        mx: 2,
        mb: 1,
        flexShrink: 0,
        borderRadius: 1.5,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: 1.5,
          py: 0.75,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Iconify
          icon="solar:magic-stick-3-bold-duotone"
          width={18}
          sx={{ color: 'primary.main' }}
        />
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: 'primary.main', flex: 1 }}
        >
          AI gợi ý câu trả lời
        </Typography>
      </Stack>

      <Box sx={{ p: 1.5 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={1}
          sx={{
            px: 1.5,
            py: 1.25,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
              maxHeight: 280,
              overflow: 'auto',
              lineHeight: 1.6,
            }}
          >
            {aiSuggestion}
          </Typography>

          <Tooltip title="Dùng đề xuất này">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onUseSuggestion(aiSuggestion!)}
              sx={{ flexShrink: 0 }}
            >
              <Iconify icon="solar:copy-bold-duotone" width={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
}
