import { preProcess } from "@/server/ai/vectordb/vectorDb";
import { protectedProcedure } from "@/server/lib/trpc";
import { ChatMode, Message } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
      messageId: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    let message = await ctx.prisma.message.findUnique({
      where: {
        id: input.messageId,
      },
      include: {
        chat: {
          include: {
            bot: true,
          },
        },
      },
    });

    validate(message);
    // biome-ignore lint/style/noNonNullAssertion: The validate function is checking if it is null.
    message = message!;

    // Save to postgres.
    await ctx.prisma.message.update({
      where: {
        id: input.messageId,
      },
      data: {
        remembered: !message.remembered,
      },
    });

    // Save to Vector DB.
    message.remembered
      ? await deleteFromVectorDb(message)
      : await saveToVectorDb({
          message: message,
          userId: ctx.user.id,
          botId: message.chat.bot.id,
          chatMode: message.chat.mode,
        });

    return {
      message: message,
    };
  });

async function deleteFromVectorDb(message: Message) {
  // In pinecone, projects in gcp-starter do not support deletion by metadata.
  // https://docs.pinecone.io/docs/metadata-filtering
  // So we will implement this later TODO.
}

async function saveToVectorDb(props: {
  message: Message;
  userId: string;
  botId: string;
  chatMode: ChatMode;
}) {
  // REMOVED FOR NOW.
  /*const pinecone = new Pinecone({
    environment: "gcp-starter",
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  const sentenceEmbeddings = new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/paraphrase-MiniLM-L6-v2",
  });

  const vStore = await PineconeStore.fromExistingIndex(sentenceEmbeddings, {
    pineconeIndex: pinecone.index("messages"),
  });

  await vStore.addDocuments([
    {
      pageContent: preProcess(props.message.content),
      metadata: {
        chatId: props.message.chatId,
        userId: props.userId,
        botId: props.botId,
        chatMode: props.chatMode,
        role: props.message.role,
        createdAt: props.message.createdAt,
        messageId: props.message.id,
      },
    },
  ]);*/
}

function validate(message: Message | null) {
  if (!message) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Message not found.",
    });
  }

  if (message.role !== "USER") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only user messages can be remembered.",
    });
  }
}
