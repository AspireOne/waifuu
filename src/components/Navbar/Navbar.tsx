import { getNavbarPaths, paths } from "@lib/paths";
import { Trans } from "@lingui/macro";
import { NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/navbar";
import {
  Button,
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
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarBrand>
        {/*TODO: LOGO*/}
        <img
          src={"/assets/logo.png"}
          alt={"logo"}
          width={"50px"}
          height={"50px"}
          className={"h-auto"}
        />
        <p className="font-bold text-inherit">Waifuu</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {getNavbarPaths().map((path) => {
          const isActive =
            path.href === paths.index
              ? activeHref === paths.index
              : activeHref.includes(path.href);

          return (
            <NavbarItem key={path.href} isActive={isActive}>
              <Link color={isActive ? undefined : "foreground"} href={path.href}>
                {path.title}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href={paths.login()}>
            <Trans>Login</Trans>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href={paths.login()} variant="flat">
            <Trans>Sign Up</Trans>
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {getNavbarPaths().map((path) => {
          const isActive = activeHref.includes(path.href);
          return (
            <NavbarMenuItem key={path.href} isActive={isActive}>
              <Link
                className={"w-full"}
                color={isActive ? undefined : "foreground"}
                href={path.href}
              >
                {path.title}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </NextNav>
  );
};
