import { NextApiRequest, NextApiResponse } from "next";
import pusher from "~/server/lib/pusherServer";
import { getUser } from "~/pages/api/utils";
import PresenceChannelMember from "~/server/types/presenceChannelMember";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: Abstract this out or remove this if unnecesarry.
  if (req.method === "OPTIONS") {
    // Pre-flight request. Reply successfully:
    res.status(200).end();
    return;
  }
  console.log("AUTHENTICATING");
  const socketId = req.body.socket_id;
  const user = await getUser(req);
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const userData: PresenceChannelMember = {
    id: user.id,
    info: {
      username: user.username!,
      image: user.image,
      bio: user.bio,
    },
  };

  // This authenticates every user. Don't do this in production!
  const authResponse = pusher.authenticateUser(socketId, userData);
  res.send(authResponse);
}
