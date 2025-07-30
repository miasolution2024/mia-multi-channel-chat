/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DashboardContent } from "@/layouts/dashboard";
import React, { useState } from "react";
import { Layout } from "../layout";
import { ChatChannels } from "../chat-channels";
import { ChatView } from "./chat-view";
import { ConversationChannel } from "@/models/conversation/conversations";

export function MultiChannelChatView() {
  const [selectedChannel, setSelectedChannel] = useState<ConversationChannel>(
    ConversationChannel.WEBSITE
  );
  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
      }}
    >
      <Layout
        sx={{
          minHeight: 0,
          flex: "1 1 0",
          borderRadius: 2,
          position: "relative",
          bgcolor: "background.paper",
          boxShadow: (theme: any) => theme.customShadows.card,
        }}
        slots={{
          nav: (
            <ChatChannels
              selectedChannel={selectedChannel}
              handleSelectChannel={setSelectedChannel}
            />
          ),
          main: <ChatView channel={selectedChannel}/>,
        }}
      />
    </DashboardContent>
  );
}
