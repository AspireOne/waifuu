import pusher from "@/server/lib/pusherServer";
import PresenceChannelMember from "@/server/shared/presenceChannelMember";
import metaHandler from "@/server/lib/metaHandler";

export default metaHandler.protected((req, res, ctx) => {
  const socketId = req.body.socket_id;

  const userData: PresenceChannelMember = {
    id: ctx.user.id,
    info: {
      username: ctx.user.username,
      image: ctx.user.image,
      bio: ctx.user.bio,
    },
  };

  // This authenticates every user. Don't do this in production!
  const authResponse = pusher.authenticateUser(socketId, userData);
  res.send(authResponse);
});
