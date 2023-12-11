import { getFooterPaths } from "@lib/paths";
import { Link } from "@nextui-org/react";
import React, { PropsWithChildren } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 text-gray-100 p-8 text-center flex flex-col gap-8 z-10 relative">
      {/*TODO: LOGO*/}
      <img
        className={"mx-auto"}
        width={"80px"}
        height={"80px"}
        src={"/assets/logo.png"}
        alt={"logo"}
      />

      <div className={"flex flex-row flex-wrap space-x-6 gap-3 justify-center"}>
        {getFooterPaths().map((item) => (
          <Link key={item.title} href={item.href} color={"secondary"}>
            {item.title}
          </Link>
        ))}
      </div>

      {/*TODO: Link to social media*/}
      <div className={"mx-auto flex flex-row gap-4 items-center"}>
        <Icon href={""}>
          <FaInstagram />
        </Icon>
        <Icon href={""}>
          <FaXTwitter />
        </Icon>
      </div>

      <div className={"text-center text-foreground-500"}>
        <p color="">&copy; {new Date().getFullYear()} Waifuu. All rights reserved.</p>
      </div>
    </footer>
  );
};

const Icon = (props: PropsWithChildren<{ href: string }>) => {
  return (
    <a href={props.href}>
      <div
        className={
          "rounded-full border border-t-gray-500 aspect-square w-min flex flex-col " +
          "justify-center text-center p-2 hover:bg-primary-500/5 duration-150 " +
          "hover:border-primary-300 hover:text-primary-200"
        }
      >
        {props.children}
      </div>
    </a>
  );
};

export default Footer;
