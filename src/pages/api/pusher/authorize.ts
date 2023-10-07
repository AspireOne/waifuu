import pusher from "~/server/lib/pusherServer";
import { prisma } from "~/server/lib/db";
import metaHandler from "~/pages/api/metaHandler";

export default metaHandler.protected(async (req, res, ctx) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  // To validate, we can check if the user is assigned to that channel in db.
  // We are not doing it rn, because we are prioritizing speed at the cost
  // of security.
  const isAssigned = prisma.rRChatQueue.findFirst({
    where: {
      userId: ctx.user.id,
      channel: channel,
    },
  });

  if (!isAssigned) {
    res.status(401).send("Unauthorized");
    return;
  }

  const presenceData = {
    user_id: ctx.user.id,
    user_info: {
      username: ctx.user.username,
      bio: ctx.user.bio,
      image: ctx.user.image,
    },
  };

  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  res.send(authResponse);
});
