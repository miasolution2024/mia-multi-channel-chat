/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from '@/models/message/message';
import { useRef, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useMessagesScroll(messages: Message[]) {
  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = useCallback(() => {
    if (!messages) {
      return;
    }

    if (!messagesEndRef.current) {
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return { messagesEndRef };
}
