import { api } from "~/utils/api";
import React, { useState } from "react";
import { ChannelData } from "~/server/api/routers/omegleChat";
import { toast } from "react-toastify";

export type RRChannelSearchStatus = "searching" | "found" | "not-found" | null;
/**
 * Custom hook for searching for a channel and exposing the data and status.
 *
 * @returns An object containing the following properties:
 *          - search: A function for initiating a search.
 *          - status: The current search status.
 *          - data: The channel data if found or null.
 *          - dataRef: A reference to the channel data to use in setTimeout callbacks.
 *          - reset: A function for resetting the channel data.
 */
export default function useRRChannelConnector() {
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [status, setStatus] = useState<RRChannelSearchStatus>(null);

  // This is here so that I can setTimeout (to check member connection) and use fresh data.
  let channelDataRef = React.useRef(channelData);
  React.useEffect(() => {
    channelDataRef.current = channelData;
  }, [channelData]);

  const searchUserMutation = api.RRChat.searchUser.useMutation({
    onMutate: () => {
      setChannelData(null);
      setStatus("searching");
    },
    onSuccess: async (channelData) => {
      if (!channelData) {
        setStatus("not-found");
        return;
      }

      setStatus("found");
      setChannelData(channelData);
    },
    onError: (error) => {
      setStatus("not-found");
      toast(error.message, { type: "error" });
      setChannelData(null);
    },
  });

  function search() {
    searchUserMutation.mutate();
  }

  return {
    search,
    status,
    data: channelData,
    datRef: channelDataRef,
    reset: () => setChannelData(null),
  };
}
