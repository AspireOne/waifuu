import Image from "next/image";

const CharacterCard = () => {
  return (
    <div className="w-[160px] rounded-lg border-1 border-gray-500 p-3">
      <Image
        src={"/assets/character.png"}
        alt="character"
        className="mt-[-14px] opacity-100"
        width={300}
        height={350}
      />
      <Image
        src={"/assets/background.png"}
        alt="character"
        className="mt-[-150px] h-[150px] rounded-lg object-cover opacity-20"
        width={300}
        height={350}
      />
      <h1 className="text-xl text-white">Fauna</h1>
      <p className="text-gray-300">Fauna is very submissive waifu</p>
    </div>
  );
};

export { CharacterCard };
