import { t } from "@lingui/macro";
import { BotVisibility } from "@prisma/client";
import React from "react";
import { IconType } from "react-icons";
import { FaUserFriends } from "react-icons/fa";
import { IoLockClosed, IoLockOpenOutline } from "react-icons/io5";
import { baseS3Url } from "./paths";

export function unescapeQuotes(str: string) {
  return str.replace(/\\"/g, '"');
}

export function isAnUrl(str: string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}" + // domain name and extension
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator
  return pattern.test(str);
}

/**
 * Takes in a string and applies markdown: *italic*, **bold**, `code`.
 * @example "Hello *world*! I am **Kate**" -> ["Hello ", <i>world</i>, "!", " I am ", <b>Kate</b>]
 */
// TODO: Use the packagr we r using.
export function applyMarkdown(text: string): React.ReactNode[] {
  const result: (string | React.ReactNode)[] = [];

  if (!text) return result;

  // Regular expression to match *, **, ` and the text between them
  const regex = /(\*\*[^*]*\*\*)|(\*[^*]*\*)|(`[^`]*`)/g;
  const splits = text.split(regex);

  for (const split of splits) {
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

export function addQueryParams(path: string, ...params: [key: string, value: string][]) {
  const url = new URL(path, window.location.origin);

  for (const param of params) {
    url.searchParams.append(param[0], param[1]);
  }

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
export function normalizePath(path: string, keepSlash = false): string {
  let norm = path;
  norm = norm.trim(); // remove leading/trailing whitespaces
  norm = norm.toLowerCase(); // convert to lowercase
  norm = norm.replace(/\\/g, "/"); // convert backslashes to slashes

  // add/remove trailing slash.
  if (keepSlash) norm = norm.endsWith("/") ? norm : `${norm}/`;
  else norm = norm.endsWith("/") ? norm.slice(0, -1) : norm;

  norm = norm.replace(/\/\/+/g, "/"); // replace all multiple slashes with a single slash
  return norm;
}

/**
 * Takes in an url OR an id of image stored in our storage.
 *
 * If it's an URL, returns the url as is.
 *
 * If it's null, returns null.
 *
 * If it's an ID, returns the url to download the image from our storage.
 *
 * @param {string | null} pathOrId - The url or ID of the image.
 */
export function makeDownloadUrl<T extends string | null | undefined>(pathOrId: T): string {
  if ((!pathOrId && pathOrId !== "") || pathOrId === "") return "";

  if (isUrl(pathOrId)) {
    return pathOrId;
  }

  return `${baseS3Url()}/${pathOrId}`;
}

export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

export function getCsrfToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrfToken"))
    ?.split("=")[1];
}

export const getBotVisibilityIcon = (
  visibility: BotVisibility,
): React.FC<React.ComponentProps<IconType>> => {
  const icons = {
    [BotVisibility.PUBLIC]: IoLockOpenOutline,
    [BotVisibility.PRIVATE]: IoLockClosed,
    [BotVisibility.LINK]: FaUserFriends,
  };

  if (!icons[visibility]) throw new Error(`Invalid visibility: ${visibility}`);

  const IconComponent = icons[visibility];
  return (props) => <IconComponent {...props} />;
};

export const getVisibilityIconTitle = (visibility: BotVisibility) => {
  const titles = {
    [BotVisibility.PUBLIC]: t`Public`,
    [BotVisibility.PRIVATE]: t`Private`,
    [BotVisibility.LINK]: t`Link-Only`,
  };

  if (!titles[visibility]) throw new Error(`Invalid visibility: ${visibility}`);
  return titles[visibility];
};
