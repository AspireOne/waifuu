import Page from "@/components/Page";
import React from "react";
import { t } from "@lingui/macro";

export default function Home() {
  return (
    <Page title={t`Home`} showActionBar autoBack={false}>
      <div></div>
    </Page>
  );
}
