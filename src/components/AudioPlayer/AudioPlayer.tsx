import { Mood } from "@prisma/client";
import React, { useRef, useEffect } from "react";

interface AudioPlayerProps {
  mood: Mood;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ mood }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks: { mood: Mood; src: string }[] = [
    {
      mood: Mood.BLUSHED,
      src: "/music/blushed.mp3",
    },
    {
      mood: Mood.HAPPY,
      src: "/music/happy.mp3",
    },
    {
      mood: Mood.NEUTRAL,
      src: "/music/neutral.mp3",
    },
    {
      mood: Mood.SAD,
      src: "/music/sad.mp3",
    },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src =
        tracks.find((item) => item.mood === mood)?.src ?? "";
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [mood]);

  return <audio loop ref={audioRef} />;
};

export default AudioPlayer;
