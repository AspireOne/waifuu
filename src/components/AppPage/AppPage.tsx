import { BasePage, PageProps } from "@components/Page";
import { PropsWithChildren } from "react";

export type AppPageProps = Omit<PageProps, "showHeader" | "unprotected" | "showActionBar"> & {
  /**
   * Main page = pages on the first level in the app. Shown in the bottom tab bar.
   *
   * @default false
   * */
  topLevel?: boolean;
};

/**
 * Page that is part of the app itself.
 * - Requires authentication
 * - Shows app header instead of navbar
 * - Shows action bar when `topLevel` is true
 * - Defines correct back button behavior
 * @param props
 * @constructor
 */
export const AppPage = (props: PropsWithChildren<AppPageProps>) => {
  return (
    <BasePage
      showHeader={true}
      unprotected={false}
      title={props.title}
      description={props.description}
      className={props.className}
      backPath={props.backPath}
      showActionBar={!!props.topLevel}
      autoBack={props.autoBack === undefined ? !props.topLevel : props.autoBack}
    >
      {props.children}
    </BasePage>
  );
};
