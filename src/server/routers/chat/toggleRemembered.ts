import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { BotChatMessage } from "@prisma/client";
import { PineconeStore } from "langchain/dist/vectorstores/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { preProcess } from "@/server/ai/vectordb/vectorDb";

export default protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
      messageId: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const message = await ctx.prisma.botChatMessage.findUnique({
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
    })!;

    validate(message);

    // Save to postgres.
    await ctx.prisma.botChatMessage.update({
      where: {
        id: input.messageId,
      },
      data: {
        remembered: !message!.remembered,
      },
    });

    // Save to Vector DB.
    message!.remembered
      ? await deleteFromVectorDb(message!)
      : await saveToVectorDb({
          message: message!,
          userId: ctx.user!.id,
          botId: message!.chat.bot.id,
          botMode: message!.chat.botMode,
        });

    return {
      message: message,
    };
  });

async function deleteFromVectorDb(message: BotChatMessage) {
  // In pinecone, projects in gcp-starter do not support deletion by metadata.
  // https://docs.pinecone.io/docs/metadata-filtering
  // So we will implement this later TODO.
}

async function saveToVectorDb(props: {
  message: BotChatMessage;
  userId: string;
  botId: string;
  botMode: string;
}) {
  const pinecone = new Pinecone({
    environment: "gcp-starter",
    apiKey: "b9f794c8-1023-40ff-9fa9-590fb59fdb1b",
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
        botMode: props.botMode,
        role: props.message.role,
        createdAt: props.message.createdAt,
        messageId: props.message.id,
      },
    },
  ]);
}

function validate(message: BotChatMessage | null) {
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
