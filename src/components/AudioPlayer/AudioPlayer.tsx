import React, { useRef, useEffect, useState } from "react";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import ReactAudioPlayer from "react-audio-player";
import { Mood } from "@prisma/client";

interface AudioPlayerProps {
  mood: Mood;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ mood }) => {
  const audioPlayerRef = useRef<ReactAudioPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlaying = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (!isPlaying) {
      audioPlayerRef.current?.updateVolume(0);
    } else {
      audioPlayerRef.current?.updateVolume(1);
      audioPlayerRef.current?.clearListenTrack();
    }
  }, [isPlaying]);

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
      <ReactAudioPlayer
        src={tracks.find((item) => item.mood === mood)?.src ?? ""}
        ref={audioPlayerRef}
        autoPlay
        loop
      />
      <button className="fixed top-0 right-2 z-[50]" onClick={togglePlaying}>
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
