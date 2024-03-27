import { useEarlyAccessStore } from "@/stores";
import { getNavbarPaths, paths } from "@lib/paths";
import {
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import {
  Chip,
  Link,
  Navbar as NextNav,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [activeHref, setActiveHref] = React.useState<string>(paths.index);

  const router = useRouter();

  useEffect(() => {
    if (!router?.isReady) return;
    setActiveHref(router.pathname);
  }, [router, router.pathname]);

  return (
    <NextNav onMenuOpenChange={setIsMenuOpen} className={"fixed"}>
      {/*@ts-ignore*/}
      <NavbarContent className="sm:hidden" justify="">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarBrand>
        {/*TODO: LOGO*/}
        <img
          src={"/assets/logo.png"}
          alt={"logo"}
          width={"50px"}
          height={"50px"}
        />
        <div>
          <p className="font-bold text-inherit">Waifuu</p>
          <Chip
            variant={"flat"}
            color={"warning"}
            size={"sm"}
            className={"sm:hidden"}
          >
            Closed Beta
          </Chip>
        </div>
      </NavbarBrand>

      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
      ></NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="flex flex-row gap-9">
          {getNavbarPaths().map((path) => {
            return <Link href={path.href}>{path.title}</Link>;
          })}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {getNavbarPaths().map((path) => {
          const isActive = activeHref.includes(path.href);
          return (
            <NavbarMenuItem key={path.href} isActive={isActive}>
              <Link className={"w-full"} href={path.href}>
                {path.title}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </NextNav>
  );
};
