import { NextPage } from "next";
import {
  Apps,
  Cart,
  ChevronBackOutline,
  ChevronDown,
  Close,
  Hammer,
  Home,
  LogIn,
  Menu,
  Person,
  Search,
} from "react-ionicons";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { api } from "~/utils/api";
import paths from "~/utils/paths";

enum ItemType {
  NORMAL,
  CATEGORY,
  PROFILE,
}

const Sidebar: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
  const session = useSession();

  useEffect(() => {
    const open = window.innerWidth > 768;
    setIsOpen(open);
    //localStorage.setItem("sidebar-open", open ? "true" : "false");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 768)
      setIsOpen(false);
  }, [
    typeof window,
    typeof window != "undefined" && window?.location?.pathname,
  ]);

  const handleItemClick = () => {
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  return (
    /*An opaque dark div that will span the whole screen.*/
    <>
      <Menu
        color={"#fff"}
        height={"50px"}
        width={"50px"}
        onClick={() => setIsOpen(!isOpen)}
        title={"menu"}
        cssClasses={`
                  z-10 border border-gray-700 shadow-lg w-12 fixed top-5 left-4 
                  cursor-pointer bg-t-blue-500 rounded-md p-2.5 ${
                    isOpen && "hidden"
                  }`}
      />

      <aside
        onClick={() => {
          // Close by clicking outside of sidebar only on mobile.
          if (window.innerWidth <= 768) setIsOpen(false);
        }}
        className={twMerge(`
                   fixed bottom-0 top-0 z-10 w-full bg-black/50 sm:sticky sm:w-min sm:bg-transparent
                   ${
                     isOpen === undefined
                       ? "hidden sm:block"
                       : !isOpen && "hidden"
                   } 
                   `)}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          height: "calc(100vh - env(safe-area-inset-top))",
        }}
      >
        <div
          className={
            "bg-t-blue-700 h-full w-[225px] p-2 sm:sticky " +
            "bg-opacity-80 shadow-2xl backdrop-blur-md sm:backdrop-blur-none"
          }
        >
          <div className={"relative h-full overflow-hidden"}>
            <div className="text-xl text-gray-100">
              <div className="mt-1 flex items-center justify-between p-2.5">
                <div className="flex items-center">
                  <img
                    alt={"Logo"}
                    width={"35px"}
                    height={"35px"}
                    src={"/assets/logo.png"}
                  />
                  <h3 className="text-md ml-3 text-gray-200">Pepe</h3>
                </div>
                <div
                  className={"-mr-2 cursor-pointer p-2 " /*+ "lg:hidden"*/}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <ChevronBackOutline color={"#c0c0c0"} title={"Zavřít menu"} />
                </div>
              </div>
              <div className="my-2 h-[1px] bg-gray-600"></div>
            </div>

            {/*<SearchBar/>*/}

            <ListItem
              text={"Nástěnka"}
              icon={<Home color={"#fff"} />}
              link={paths.index}
            />

            {/*TODO: Fix that it shifts with navigation bar on mobile...;*/}
            <div className={"absolute bottom-14 left-0 right-0 sm:bottom-0 "}>
              {session.status === "authenticated" && (
                <ListItem
                  text={session.data.user?.name || "Profil"}
                  link={""}
                  icon={
                    session.data.user?.image ? (
                      <img
                        alt={"Profilový obrázek"}
                        className={"rounded-full"}
                        width={35}
                        height={"auto"}
                        src={session.data.user?.image}
                      />
                    ) : (
                      <Person color={"#fff"} />
                    )
                  }
                />
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Category = (props: React.PropsWithChildren<{ text: string }>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div>
      <ListItem
        icon={<ChevronDown color={"#fff"} />}
        text={props.text}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      <div
        className={
          "mx-auto mt-1 w-4/5 text-left text-sm font-bold text-gray-200" +
          (isDropdownOpen ? "" : " hidden")
        }
      >
        {props.children}
      </div>
    </div>
  );
};

function ListItem(props: {
  icon?: any;
  text: string;
  className?: string;
  onClick?: () => void;
  link?: string;
  isCategoryItem?: boolean;
  alignBottom?: boolean;
  remaining?: { subTokens: number; freeTokens: number } | null;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActive(props.link === window?.location?.pathname);
    }
  }, [
    typeof window,
    typeof window != "undefined" && window?.location?.pathname,
  ]);

  // @ts-ignore
  const content = (
    <div
      className={twMerge(`mt-3 flex cursor-pointer items-center rounded-md bg-opacity-50 p-2.5 
        px-4 text-white hover:bg-gray-500 hover:bg-opacity-40 ${
          active && "bg-gray-500"
        } ${props.className}`)}
      onClick={props.onClick}
    >
      <div className={"min-h-[22px] min-w-[22px]"}>{props.icon}</div>
      <div className={"text-overflow: ellipsis; ml-4 flex flex-col gap-1"}>
        <span
          className={`text-[${
            props.isCategoryItem ? 14 : 15
          }px] overflow-x-hidden overflow-ellipsis whitespace-nowrap font-bold text-gray-200`}
        >
          {props.text}
        </span>
      </div>
    </div>
  );

  return (
    <div>
      {props.link ? <Link href={props.link}>{content}</Link> : <>{content}</>}
    </div>
  );
}

export default Sidebar;
