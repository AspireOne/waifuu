import { Place } from "@prisma/client";
import React, { useRef, useState } from "react";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";

interface AudioPlayerProps {
  place: Place;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ place }) => {
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

  const tracks: { place: Place; src: string }[] = [
    {
      place: Place.HOME,
      src: "/music/place_home.mp3",
    },
    {
      place: Place.PARK,
      src: "/music/place_park.mp3",
    },
    {
      place: Place.WORK,
      src: "/music/place_office.mp3",
    },
  ];

  return (
    <>
      <audio
        src={tracks.find((item) => item.place === place)?.src ?? ""}
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
