import { api } from "@lib/api";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { toast } from "react-toastify";

export const useUnsubscribeMutation = () => {
  const apiUtils = api.useUtils();
  const { _ } = useLingui();

  return api.plans.unsubscribe.useMutation({
    onSuccess: async () => {
      // TODO: Redirect to unsubscribe success page.
      toast(_(msg`Successfully unsubscribed.`), { type: "success" });
      await apiUtils.users.getSelf.refetch();
    },
    onError() {
      // TOOO: Show a modal with instructions to contact support.
      toast(_(msg`Failed to unsubscribe. Please contact support.`), { type: "error" });
    },
  });
};
