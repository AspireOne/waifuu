import { api } from "~/utils/api";
import React, { useState } from "react";
import { ChannelData } from "~/server/api/routers/omegleChat";
import { toast } from "react-toastify";

export type SearchStatus = "searching" | "found" | "not-found" | null;
export default function useOmegleChatSearch() {
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [status, setStatus] = useState<SearchStatus>(null);

  // This is here so that I can setTimeout (to check member connection) and use fresh data.
  let channelDataRef = React.useRef(channelData);
  React.useEffect(() => {
    channelDataRef.current = channelData;
  }, [channelData]);

  const searchUserMutation = api.omegleChat.searchUser.useMutation({
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
    channelData,
    channelDataRef,
    resetChannelData: () => setChannelData(null),
  };
}
