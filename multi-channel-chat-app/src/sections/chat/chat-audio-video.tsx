"use client";

import { Dialog, DialogContent } from "@mui/material";
import React from "react";
import { VideoPlayer, AudioPlayer } from "react-video-audio-player";

interface ChatAudioVideoProps {
  isOpenDialog: boolean;
  onClose: () => void;
  itemType: "audio" | "video";
  itemUrl: string;
}

const ChatAudioVideo: React.FC<ChatAudioVideoProps> = ({
  isOpenDialog,
  onClose,
  itemType,
  itemUrl,
}) => {
  if (itemType !== "audio" && itemType !== "video") return null;

  const dialogStyles: React.CSSProperties = {
    maxWidth: itemType === "video" ? "90vw" : "80vw",
    maxHeight: itemType === "video" ? "90vh" : undefined,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    background: "transparent",
    boxShadow: "none",
    borderRadius: itemType === "audio" ? 12 : 8,
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
          padding: itemType === "video" ? 0 : 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
          overflow: "visible",
          position: "relative",
        }}
      >
        {itemType === "audio" ? (
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
