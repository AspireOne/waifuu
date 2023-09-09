import { Button, Chip, Input } from "@nextui-org/react";
import Image from "next/image";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { CharacterCard } from "~/components/Character/CharacterCard";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Navbar } from "~/components/Navbar";
import { FaCompass, FaTag } from "react-icons/fa";

const Discover = () => {
  return (
    <div className="bg-black">
      <Navbar />
      <div className="hidden h-[350px] overflow-hidden sm:block">
        <Image
          alt="background"
          loading="eager"
          className="opacity-30"
          src={"/assets/background.png"}
          width={1920}
          height={1080}
        />
        <div className="absolute left-0 top-[64px] flex h-[350px] h-full w-full flex-row">
          <div className="clear-both">
            <BiChevronLeft
              color="white"
              fontSize={70}
              className="mt-[150px] cursor-pointer"
            />
          </div>

          <div className="align-center absolute mx-auto flex w-fit flex-row sm:relative">
            <Image
              alt="background"
              loading="eager"
              src={"/assets/character.png"}
              className="h-[350px] w-[300px]"
              width={1920}
              height={1080}
            />
            <div className="mt-[50px] flex w-[400px] flex-col gap-4">
              <h1 className="text-6xl font-extrabold text-white">Fauna</h1>
              <p className="text-white">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt
                iure recusandae sapiente repellat quasi tenetur!
              </p>
              <Button>Buy now</Button>
            </div>
          </div>

          <div className="clear-both">
            <BiChevronRight
              color="white"
              fontSize={70}
              className="mt-[150px] cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-[70%] p-5">
        <div className="mb-10 mt-7">
          <h3 className="mb-3 flex flex-row gap-2 text-3xl text-white">
            <FaCompass /> Active chats
          </h3>
        </div>

        <div className="flex scrollbar overflow-scroll scrollbar-thumb-gray-700 scrollbar-track-transparent overflow-x-visible w-full flex-row gap-5">
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
        </div>
      </div>

      <div className="mx-auto w-[70%] p-5">
        <div className="mb-10 mt-7">
          <h3 className="mb-3 flex flex-row gap-2 text-3xl text-white">
            <FaTag /> Popular tags
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              "Bordered",
              "Bordered",
              "Bordered",
              "Bordered",
              "Bordered",
              "Bordered",
              "Bordered",
              "Bordered",
              "Bordered",
              "Bordered",
            ].map((tag) => {
              return (
                <Chip size="lg" color="default" variant="bordered">
                  Bordered
                </Chip>
              );
            })}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <FaMagnifyingGlass color="white" fontSize={20} />
            <p className="text-white">Search</p>
          </div>
          <Input className="w-fit rounded-lg text-white" type="text" />
        </div>

        <div className="flex flex-wrap gap-5">
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
          <CharacterCard />
        </div>
      </div>
    </div>
  );
};

export default Discover;
