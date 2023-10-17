import { Button, Card, Modal, ModalContent, Textarea } from "@nextui-org/react";
import { ForumPost, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { api } from "~/lib/api";
import { PiArrowElbowRightDownBold } from "react-icons/pi";
import { useState } from "react";

type Post = ForumPost & {
  author: User;
  comments: Post[];
  liked: boolean;
};

type ForumPostProps = {
  comment: Post;
  onCommentToggle: VoidFunction;
  onLikeToggle: VoidFunction;
  isOpen: boolean;
  nestedLevel: number;
};

type SubmitData = {
  content: string;
};

export const ForumPostComment = ({
  comment,
  onCommentToggle,
  onLikeToggle,
  isOpen,
  nestedLevel = 0,
}: ForumPostProps) => {
  const { register, handleSubmit } = useForm<SubmitData>();
  const createCommentMutation = api.forum.comment.useMutation();

  const [isLiked, setIsLiked] = useState(comment.liked ?? false);
  const likeMutation = api.forum.like.useMutation({
    onSuccess: () => setIsLiked(true),
  });
  const dislikeMutation = api.forum.dislike.useMutation({
    onSuccess: () => setIsLiked(false),
  });
  const onLike = (postId: string) => {
    if (isLiked) {
      dislikeMutation.mutate({ id: postId });
    } else {
      likeMutation.mutate({ id: postId });
    }
  };

  const onSubmit = (data: SubmitData) => {
    createCommentMutation.mutateAsync({
      content: data.content,
      parentPostId: comment.id,
    });

    onCommentToggle();
  };

  const makeStylesBackground = () => {
    switch (nestedLevel) {
      case 0:
        return "#111827";
      case 1:
        return "#1f2937";
      case 2:
        return "#374151";
    }
  };

  return (
    <Card style={{ background: makeStylesBackground() }} className={`p-4 mt-3`}>
      <div className="flex flex-row gap-5">
        <div className="flex flex-row gap-2">
          {/* <Image
            src={comment.author.image ?? "/default-avatar.png"}
            width={50}
            className="rounded-full h-[50px] w-[50px]"
            height={50}
            alt="Avatar"
          /> */}

          <div className="flex flex-col spacing-2">
            <p>{comment.author.name}</p>
            <p className="text-gray-400">@{comment.author.username}</p>
          </div>
        </div>

        <div className="flex flex-row gap-4 mx-auto mr-4 mt-2.5">
          {isLiked ? (
            <AiFillHeart
              onClick={() => onLike(comment.id)}
              className="text-gray-500 hover:cursor-pointer"
              fontSize={20}
            />
          ) : (
            <AiOutlineHeart
              onClick={() => onLike(comment.id)}
              className="text-gray-500 hover:cursor-pointer"
              fontSize={20}
            />
          )}

          <FaComment
            onClick={onCommentToggle}
            className="text-primary-500 hover:cursor-pointer"
            fontSize={20}
          />
        </div>
      </div>

      <p className="mt-3 mb-3 text-white">{comment.content}</p>

      {comment.comments.length > 0 && (
        <p className="text-white text-lg flex flex-row font-semibold mb-3 mt-4">
          Replies <PiArrowElbowRightDownBold className="mt-2 ml-2" />
        </p>
      )}

      {comment.comments.map((nestedComment) => (
        <ForumPostComment
          key={nestedComment.id}
          comment={nestedComment}
          onCommentToggle={onCommentToggle}
          onLikeToggle={onLikeToggle}
          isOpen={isOpen}
          nestedLevel={nestedLevel + 1}
        />
      ))}

      <Modal isOpen={isOpen} onClose={onCommentToggle}>
        <ModalContent className="p-3">
          <h1 className="text-lg font-bold">Create a new comment</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <Textarea {...register("content")} placeholder="Comment" />
            <Button isLoading={createCommentMutation.isLoading} type="submit">
              Submit
            </Button>
          </form>
        </ModalContent>
      </Modal>
    </Card>
  );
};
