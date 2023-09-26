import React from "react";
import Page from "~/components/Page";

export default function LandingPage() {
  // Todo: meta description.
  return (
    <Page
      metaTitle={"Companion"}
      unprotected
      header={{ enabled: false }}
      showMobileNav={false}
    >
      <div>Here will be landing page</div>
      <button>Click here to get to app homepage</button>
    </Page>
  );
}
