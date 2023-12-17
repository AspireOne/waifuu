import { PropsWithChildren } from "react";
import { BasePage, PageProps } from "src/components/BasePage";

export type AppPageProps = Omit<
  PageProps,
  "topBar" | "unprotected" | "showActionBar" | "showFooter"
> & {
  /**
   * Main page = pages on the first level in the app. Shown in the bottom tab bar.
   *
   * @default false
   * */
  topLevel?: boolean;
  backPath: string | null;
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
      topBar={"app-header"}
      unprotected={false}
      showActionBar={!!props.topLevel}
      showFooter={false}
      autoBack={props.autoBack === undefined ? !props.topLevel : props.autoBack}
      {...props}
    >
      {props.children}
    </BasePage>
  );
};
