import { NextApiRequest, NextApiResponse } from "next";
import pusher from "~/server/lib/pusherServer";
import { getUser } from "~/pages/api/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  console.log("AUTHENTICATING");
  const user = await getUser(req);
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const presenceData = {
    user_id: user.id,
    user_info: { username: user.username, bio: user.bio, image: user.image },
  };

  // This authenticates every user. Don't do this in production!
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  res.send(authResponse);
}
