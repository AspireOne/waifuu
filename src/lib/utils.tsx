import { apiBase } from "@lib/api";
import React from "react";
import { toast } from "react-toastify";

/**
 * Generates a random UUID (Universally Unique Identifier).
 * Example: 8b3e8a1e-4b9b-4b4b-9b9b-4b9b4b9b4b9b
 * @returns {string} A randomly generated UUID string.
 */
export default function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function showErrorToast(error: Error) {
  toast(error?.message || "Something went wrong", {
    type: "error",
  });
}

/**
 * Takes in a string and applies markdown: *italic*, **bold**, `code`.
 * @example "Hello *world*! I am **Kate**" -> ["Hello ", <i>world</i>, "!", " I am ", <b>Kate</b>]
 */
export function applyMarkdown(text: string): React.ReactNode[] {
  let result: (string | React.ReactNode)[] = [];

  if (!text) return result;

  // Regular expression to match *, **, ` and the text between them
  let regex = /(\*\*[^*]*\*\*)|(\*[^*]*\*)|(`[^`]*`)/g;
  let splits = text.split(regex);

  for (let split of splits) {
    if (!split) continue;

    if (split.startsWith("**") && split.endsWith("**")) {
      result.push(<b key={split}>{split.slice(2, -2)}</b>);
    } else if (split.startsWith("*") && split.endsWith("*")) {
      result.push(
        <i className={"text-foreground-500"} key={split}>
          {"\n"}
          {split.slice(1, -1)}
          {"\n"}
        </i>,
      );
    } else if (split.startsWith("`") && split.endsWith("`")) {
      result.push(<code key={split}>{split.slice(1, -1)}</code>);
    } else {
      // Keep the string as it is if it's not surrounded by special characters
      result.push(split);
    }
  }

  return result;
}

export function addQueryParams(
  path: string,
  ...params: [key: string, value: string][]
) {
  const url = new URL(path, window.location.origin);

  params.forEach((param) => {
    url.searchParams.append(param[0], param[1]);
  });

  return url.pathname + url.search;
}

/**
 * Normalizes the given path by removing leading/trailing whitespaces, converting to lowercase,
 * converting backslashes to slashes, adding or removing trailing slashes, and replacing multiple
 * slashes with a single slash.
 *
 * @param {string} path - The path to be normalized.
 * @param {boolean} [keepSlash=false] - Whether to keep the trailing slash or not.
 *
 * @return {string} The normalized path.
 */
export function normalizePath(
  path: string,
  keepSlash: boolean = false,
): string {
  path = path.trim(); // remove leading/trailing whitespaces
  path = path.toLowerCase(); // convert to lowercase
  path = path.replace(/\\/g, "/"); // convert backslashes to slashes

  // add/remove trailing slash.
  if (keepSlash) path = path.endsWith("/") ? path : path + "/";
  else path = path.endsWith("/") ? path.slice(0, -1) : path;

  path = path.replace(/\/\/+/g, "/"); // replace all multiple slashes with a single slash
  return path;
}

export function makeDownloadPath(id: string): string {
  return apiBase(`/api/images/download?id=${id}`);
}
