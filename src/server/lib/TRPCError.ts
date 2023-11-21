import { TRPCError as OriginalTRPCError } from "@trpc/server";
import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/src/rpc/codes";

type TRPC_ERROR_CODE_KEY = keyof typeof TRPC_ERROR_CODES_BY_KEY;
export type ToastType = "info" | "warning" | "error";

/**
 * Error based on native TRPCError, but with added "toast" field.
 * This message is supposed to be displayed directly to the user in a toast.
 * */
export class TRPCError extends OriginalTRPCError {
  /** This is a toast that will be shown to the user on the frontend. */
  public readonly toast?: string | null;
  public readonly toastType?: ToastType | null;

  constructor(opts: {
    /** This is the internal error message. */
    message?: string;
    cause?: unknown;
    /** This is a toast that will be shown to the user on the frontend. Specify NULL to not show any toast. */
    toast?: string | null;
    toastType?: ToastType;
    code: TRPC_ERROR_CODE_KEY;
  }) {
    super(opts);
    this.toast = opts.toast;
    this.toastType = opts.toastType;
  }
}
