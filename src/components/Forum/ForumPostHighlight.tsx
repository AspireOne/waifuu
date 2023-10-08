import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { FaEye, FaHeart } from "react-icons/fa";
import { LargeText } from "../shared/LargeText";

type ForumPostHighlightProps = {
  title: string;
  caption: string;
  likes: number;
  reads: number;
  image: string;
};

export const ForumPostHighlight = ({
  title,
  caption,
  likes,
  reads,
  image,
}: ForumPostHighlightProps) => {
  return (
    <Card>
      <Image
        src={image}
        width={100}
        removeWrapper
        className={`h-[100px] w-full object-cover z-0 mx-auto rounded-lg bg-gray-100`}
        height={100}
        alt="Forum Post Image"
      />

      <CardBody>
        <h1 className="text-lg text-center font-bold">{title}</h1>
        <LargeText
          className="text-gray-400 text-center"
          content={caption}
          maxLength={100}
        />

        <div className="flex flex-row gap-2 w-fit mx-auto mt-3">
          <section className="text-center">
            <FaHeart color="red" className="mx-auto w-fit" />
            <p>{likes}</p>
          </section>

          <section className="text-center">
            <FaEye color="lightblue" className="mx-auto w-fit" />
            <p>{reads}</p>
          </section>
        </div>
      </CardBody>
    </Card>
  );
};
