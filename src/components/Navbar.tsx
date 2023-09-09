import { useDrawerStore } from "~/stores";
import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function Navbar() {
  const drawer = useDrawerStore();
  const [expanded, setExpanded] = useState();

  return (
    <nav className="bg-brand-200/50 fixed left-4 right-4 top-4 flex items-center justify-between rounded-xl border-[1px] border-gray-300 px-6 py-4 shadow-md backdrop-blur-lg">
      <div className={"flex items-center gap-4"}>
        <img
          className={"h-auto w-8"}
          src={
            "https://user-images.githubusercontent.com/57546404/264742549-7be355b8-4bfe-4c9c-9bd7-539892224db8.png"
          }
        />
        <p className={"text-lg font-semibold text-gray-700"}>Pepe - Demo</p>
      </div>

      <div className={"flex items-center gap-3"}>
        <Item href={"/"} title={"Domov"} />
        <Item href={"/"} title={"Cvičení"} />
      </div>

      <div>
        <AiOutlineUser size={24} />
      </div>
    </nav>
  );
}

function Item(props: { href: string; title: string }) {
  return (
    <Button variant={"light"} className={"text-lg font-semibold"}>
      <Link href={props.href}>{props.title}</Link>
    </Button>
  );
}
