import pusher from "@/server/clients/pusherServer";
import metaHandler from "@/server/lib/metaHandler";
import PresenceChannelMember from "@/server/shared/presenceChannelMember";

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
