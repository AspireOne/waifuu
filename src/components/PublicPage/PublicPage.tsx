import { PropsWithChildren } from "react";
import { BasePage } from "src/components/BasePage";

/**
 * Public page that is NOT part of the app itself.
 * - Does not require authentication
 * - Classic browser navbar
 * - No action bar, header, or any app-specific elements.
 * @param props
 * @constructor
 */
export const PublicPage = (
  props: PropsWithChildren<{ title: string; description: string; className?: string }>,
) => {
  return (
    <BasePage
      unprotected={true}
      topBar={"navbar"}
      showActionBar={false}
      autoBack={true}
      {...props}
    >
      {props.children}
    </BasePage>
  );
};
