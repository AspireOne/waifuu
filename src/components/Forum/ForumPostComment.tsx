import { Card, CardFooter } from "@nextui-org/react";
import { ForumPost } from "@prisma/client";
import { FaHeart } from "react-icons/fa";

export const ForumPostComment = (data: ForumPost) => {
    return (
        <Card className="p-2">
            <p>{data.content}</p>

            <CardFooter className="flex flex-start flex-col gap-2">
                <FaHeart color="red" fontSize={30} />
                <p>{parseInt(data.likeCount.toString())}</p>
            </CardFooter>
        </Card>
    )
};