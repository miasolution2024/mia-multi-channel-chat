// components/NotificationSound.tsx
import { CONFIG } from '@/config-global';
import React, { useRef, useEffect } from 'react';

interface NotificationSoundProps {
  play: boolean;
}

const NotificationSound: React.FC<NotificationSoundProps> = ({ play }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing sound:", error);
      });
    }
  }, [play]);

  return (
    <audio ref={audioRef} src={`${CONFIG.assetsDir}/assets/sounds/notification.mp3`} preload="auto">
      Your browser does not support the audio element.
    </audio>
  );
};

export default NotificationSound;