"use client";

import { Dialog, DialogContent } from "@mui/material";
import React from "react";
import { VideoPlayer, AudioPlayer } from "react-video-audio-player";
import { MessageType } from "@/models/message/message";

interface ChatAudioVideoProps {
  isOpenDialog: boolean;
  onClose: () => void;
  itemType: MessageType.AUDIO | MessageType.VIDEO;
  itemUrl: string;
}

const ChatAudioVideo: React.FC<ChatAudioVideoProps> = ({
  isOpenDialog,
  onClose,
  itemType,
  itemUrl,
}) => {
  if (itemType !== MessageType.AUDIO && itemType !== MessageType.VIDEO)
    return null;

  const dialogStyles: React.CSSProperties = {
    maxWidth: itemType === MessageType.VIDEO ? "90vw" : "80vw",
    maxHeight: itemType === MessageType.VIDEO ? "90vh" : undefined,
    width: itemType === MessageType.VIDEO ? "auto" : "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    background: "transparent",
    boxShadow: "none",
    borderRadius: itemType === MessageType.AUDIO ? 12 : 0,
    overflow: "visible",
  };

  return (
    <Dialog
      onClose={onClose}
      open={isOpenDialog}
      PaperProps={{ style: dialogStyles }}
    >
      <DialogContent
        style={{
          width: "100%",
          padding: itemType === MessageType.VIDEO ? 0 : 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
          overflow: "visible",
          position: "relative",
        }}
      >
        {itemType === MessageType.AUDIO ? (
          <div style={{ width: "100%", maxWidth: 500 }}>
            <AudioPlayer controls style={{ width: "100%" }} src={itemUrl} />
          </div>
        ) : (
          <VideoPlayer
            controls
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
            }}
            src={itemUrl}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatAudioVideo;
