import React, { useRef, useState } from "react";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { Mood } from "@prisma/client";

interface AudioPlayerProps {
  mood: Mood;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ mood }) => {
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const onClickToggle = () => {
    if (!audioPlayerRef.current) return;

    if (audioPlayerRef.current.paused) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    } else {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

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

  return (
    <>
      <audio
        src={tracks.find((item) => item.mood === mood)?.src ?? ""}
        ref={audioPlayerRef}
        onLoadedData={() => {
          if (audioPlayerRef.current && isPlaying) {
            audioPlayerRef.current.play();
            setIsPlaying(true);
          }
        }}
        loop
      >
        <track kind="captions" />
      </audio>

      <button className="fixed top-0 right-2 z-[50]" onClick={onClickToggle}>
        {isPlaying ? (
          <HiMiniSpeakerWave color="white" className="w-[50px] h-[50px]" />
        ) : (
          <HiMiniSpeakerXMark color="white" className="w-[50px] h-[50px]" />
        )}
      </button>
    </>
  );
};

export default AudioPlayer;
