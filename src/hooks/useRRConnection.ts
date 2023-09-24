import React, { useEffect, useState } from "react";
import { pusherClient } from "~/lib/pusherClient";
import { PresenceChannel } from "pusher-js";
import PresenceChannelMember from "~/server/types/presenceChannelMember";

export type ConnectionStatus =
  | "no-channel"
  | "subscribing"
  | "subscribe-failed"
  | "subscribed-no-user"
  | "subscribed-w-user"
  | "subscribed-user-left";

/**
 * Creates and manages a connection to a Pusher presence channel.
 *
 * @param {string | null} channelName - The name of the channel to connect to. If null or undefined, the connection will be closed.
 */
const useRRConnection = (channelName?: string | null) => {
  const [status, setStatus] = useState<ConnectionStatus>("no-channel");
  const [lastUser, setLastUser] = useState<PresenceChannelMember | null>(null);
  const [channel, setChannel] = useState<PresenceChannel | null>(null);

  let statusRef = React.useRef(status);
  React.useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!channelName) {
      channel?.unsubscribe();
      setChannel(null);
      setStatus("no-channel");
      return;
    }

    if (channel?.name !== channelName) {
      setStatus("subscribing");
      channel?.unsubscribe();

      const newChannel = pusherClient.subscribe(channelName) as PresenceChannel;
      setChannel(newChannel);

      newChannel.bind("pusher:error", (data: any) => {
        console.log("pusher:error", data);
      });
      newChannel.bind("pusher:subscription_succeeded", () => {
        if (newChannel!.members.count > 1) {
          setStatus("subscribed-w-user");
          setLastUser(getOtherMember(newChannel));
        } else {
          setStatus("subscribed-no-user");
        }
        console.log(
          "subscription_succeeded. Members: " + newChannel!.members.count,
        );
      });

      newChannel.bind("pusher:subscription_error", () => {
        setStatus("subscribe-failed");
        console.log("subscription_error");
      });

      newChannel.bind("pusher:member_removed", () => {
        setStatus("subscribed-user-left");
        console.log("member_removed");
      });

      newChannel.bind(
        "pusher:member_added",
        (member: PresenceChannelMember) => {
          if (newChannel!.members.count > 1) {
            setStatus("subscribed-w-user");
            setLastUser(getOtherMember(newChannel));
          }
          console.log("member_added");
        },
      );
    }
  }, [channelName]);

  return { status, statusRef, channel, lastUser };
};

function getOtherMember(
  channel: PresenceChannel | null,
): PresenceChannelMember | null {
  if (!channel) return null;

  let newMember: PresenceChannelMember | null = null;
  channel.members.each((member: PresenceChannelMember) => {
    if (newMember) return;
    if (member.id !== channel.members.me.id) newMember = member;
  });

  return newMember;
}

export { useRRConnection };
