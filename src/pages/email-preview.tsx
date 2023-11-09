import { api } from "@lib/api";
import { Kbd } from "@nextui-org/kbd";
import { Button, Divider, Spacer, Tab, Tabs } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

type Template = {
  name: string;
  html: string;
};
export default () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | undefined>();

  const [selectedTab, setSelectedTab] = useState<"rendered" | "html">("rendered");
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light">("light");
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop");

  const [tabsVisible, setTabsVisible] = useState<boolean>(true);

  const { data, refetch, isLoading, isRefetching } = api.general.getEmailTemplates.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        setTemplates(data);
        if (selected) {
          const newSelected = data.find((template) => template.name === selected.name);
          if (newSelected) setSelected(newSelected);
          else setSelected(undefined);
        }
      },
      refetchInterval: 10_000,
    },
  );

  // useEffect that captures global press event of "R" key and refetches.
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === "KeyR") {
        toast("R-efreshing...", {
          autoClose: 1000,
          position: "bottom-left",
          pauseOnHover: false,
        });
        refetch();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [refetch]);

  const Sidebar = () => {
    return (
      <div className={"w-[230px] min-h-[200px] border-r-1 border-gray-500 p-4 shadow"}>
        <div>
          <p className={"text-md font-bold text-center"}>❤ Preview by @Aspire</p>
          <Spacer y={6} />
          <Divider />
          <Spacer y={6} />
          <Tooltip
            content={
              "Refreshes the content of the currently opened email AND refetches email files."
            }
            delay={1000}
          >
            <Button
              isLoading={isLoading || isRefetching}
              className={"w-full"}
              variant={"bordered"}
              onClick={() => refetch()}
            >
              Refresh <Kbd>R</Kbd>
            </Button>
          </Tooltip>
          <Spacer y={6} />
          <Divider />
          <Spacer y={6} />

          <div className={"flex flex-col gap-4"}>
            {templates.map((template) => (
              <Button
                key={template.name}
                variant={template.name === selected?.name ? "shadow" : "ghost"}
                color={template.name === selected?.name ? "primary" : "default"}
                onClick={() => setSelected(template)}
                className={"w-full"}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Body = (props: { mode: "rendered" | "html" }) => {
    return (
      <div
        className={twMerge(
          "relative flex-1 w-full h-full min-h-[95vh] m-4 rounded-lg shadow border border-gray-500 mx-auto",
          /*"flex flex-col justify-center items-center",*/
          selectedTheme === "dark" ? "" : "bg-white text-gray-900",
          previewMode === "mobile" ? "max-w-[379px]" : "max-w-[1000px]",
        )}
      >
        {!selected && <p>No mail selected</p>}

        {selected && props.mode === "rendered" && (
          // biome-ignore lint/security/noDangerouslySetInnerHtml: It is correct in this place.
          <div dangerouslySetInnerHTML={{ __html: selected.html }} />
        )}

        {selected && props.mode === "html" && (
          <p className={"whitespace-break-spaces"}>{selected?.html}</p>
        )}

        <div className={"absolute top-2 right-2 flex flex-row gap-2 items-center"}>
          {tabsVisible && <ActionTabs />}
          <Tooltip content={"Open/Close tools"} delay={1000}>
            <Button
              size={"sm"}
              className={"shadow"}
              isIconOnly={true}
              onClick={() => setTabsVisible(!tabsVisible)}
            >
              <AiOutlineMenu />
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  };

  const ActionTabs = () => {
    return (
      <div className={"flex flex-row gap-4 justify-content-end"}>
        <Tabs
          size={"sm"}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as "rendered" | "html")}
        >
          <Tab key={"rendered"} title={"Mail"} />
          <Tab key={"html"} title={"HTML"} />
        </Tabs>

        <Tabs
          size={"sm"}
          selectedKey={previewMode}
          onSelectionChange={(key) => setPreviewMode(key as "mobile" | "desktop")}
        >
          <Tab key={"mobile"} title={"Mobile"} />
          <Tab key={"desktop"} title={"Desktop"} />
        </Tabs>

        {/*<Tabs
              selectedKey={selectedTheme}
              onSelectionChange={(key) => setSelectedTheme(key as "dark" | "light")}
            >
              <Tab key={"dark"} title={"Dark"} />
              <Tab key={"light"} title={"Light"} />
            </Tabs>*/}
      </div>
    );
  };

  return (
    <div className={"flex flex-row min-h-screen w-full"}>
      <Sidebar />
      <Body mode={selectedTab === "rendered" ? "rendered" : "html"} />
    </div>
  );
};
