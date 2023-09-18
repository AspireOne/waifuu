import React, { useEffect, useState } from "react";
import { pusherClient } from "~/lib/pusherClient";
import { PresenceChannel } from "pusher-js";

type ChatStatus =
  | "no-channel"
  | "subscribing"
  | "subscribe-failed"
  | "subscribed-no-user"
  | "subscribed-w-user"
  | "subscribed-user-left";

let channel: PresenceChannel | null = null;
const useOmegleChatConnection = (channelName?: string | null) => {
  const [status, setStatus] = useState<ChatStatus>("no-channel");

  let statusRef = React.useRef(status);
  React.useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!channelName) {
      channel?.unsubscribe();
      channel = null;
      setStatus("no-channel");
      return;
    }

    if (channel?.name !== channelName) {
      setStatus("subscribing");
      channel?.unsubscribe();
      channel = pusherClient.subscribe(channelName) as PresenceChannel;

      channel.bind("pusher:error", (data: any) => {
        console.log("pusher:error", data);
      });
      channel.bind("pusher:subscription_succeeded", () => {
        if (channel!.members.count > 1) {
          setStatus("subscribed-w-user");
        } else {
          setStatus("subscribed-no-user");
        }
        console.log(
          "subscription_succeeded. Members: " + channel!.members.count,
        );
      });

      channel.bind("pusher:subscription_error", () => {
        setStatus("subscribe-failed");
        console.log("subscription_error");
      });

      channel.bind("pusher:member_removed", () => {
        setStatus("subscribed-user-left");
        console.log("member_removed");
      });

      channel.bind("pusher:member_added", () => {
        if (channel!.members.count > 1) {
          setStatus("subscribed-w-user");
        }
        console.log("member_added");
      });
    }
  }, [channelName]);
  return { status, statusRef, channel };
};

export { useOmegleChatConnection };
