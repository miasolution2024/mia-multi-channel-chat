"use client";

import { PlayerAPI, PlayerConfig, SourceConfig } from "bitmovin-player";
import { BitmovinPlayer } from "bitmovin-player-react";

const playerConfig: PlayerConfig = {
  key: "ee0c9dd1-6721-4dc0-98fe-2b9861962d2a",
  playback: {
    muted: true,
    autoplay: true,
  },
};

const playerSource: SourceConfig = {
  dash: "https://d210m0ew2lf6nx.cloudfront.net/6e58a6b9-4968-435f-b47f-064f7a1bf0d9/test/stream.mpd",
};

export function VideoPlayer() {
  const handlePlayerRef = (player: PlayerAPI) => {
    console.log("Player version", player.getAvailableVideoQualities());
    console.log("Player version", player.getPlaybackVideoData());
  };
  return (
    <>
      <h1>Simple demo</h1>
      <BitmovinPlayer
        config={playerConfig}
        source={playerSource}
        playerRef={handlePlayerRef}
      />
    </>
  );
}
