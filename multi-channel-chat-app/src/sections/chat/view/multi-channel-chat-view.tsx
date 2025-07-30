/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DashboardContent } from "@/layouts/dashboard";
import React, { useEffect, useState } from "react";
import { Layout } from "../layout";
import { ChatChannels } from "../chat-channels";
import { ChatView } from "./chat-view";
import { ConversationChannel } from "@/models/conversation/conversations";
import { paths } from "@/routes/path";
import { useRouter, useSearchParams } from "next/navigation";

export function MultiChannelChatView() {
  const [selectedChannel, setSelectedChannel] = useState<ConversationChannel>(
    ConversationChannel.WEBSITE
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    for (const key of searchParams.keys()) {
      if (key !== "id") {
        newSearchParams.append(key, searchParams.get(key) || "");
      }
    }
    newSearchParams.set("channel", selectedChannel);
    const newQueryString = newSearchParams.toString();
    console.log(newQueryString);
    
    router.push(`${paths.dashboard.chat}?${newQueryString}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

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
          main: <ChatView channel={selectedChannel} />,
        }}
      />
    </DashboardContent>
  );
}
