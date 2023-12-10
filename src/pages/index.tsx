import { Emoji } from "@/components/ui/Emoji";
import Discover from "@/pages/discover";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Spacer,
} from "@nextui-org/react";
import Image from "next/image";

import { PublicPage } from "@components/PublicPage";
import { paths, publicNavbarPaths } from "@lib/paths";
import { Trans } from "@lingui/macro";
import { NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/navbar";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";

// If building for a native app, we don't want to show the landing page as the index screen.
// So if we are building for a native app, we export Homepage instead.

const topBarArr = [
  {
    name: "Home",
    scrollTo: 0,
  },
  {
    name: "Pricing",
    scrollTo: 500,
  },
  {
    name: "Start",
    scrollTo: 2000,
  },
];

const TopBar = () => {
  return (
    <div className="sticky top-5 w-full flex flex-row z-10">
      <h1 className="font-bold text-xl flex flex-row gap-2">
        <Emoji className="w-[30px] h-[30px]" name="chat" />
        Waifuu
      </h1>

      <div
        className={twMerge([
          "w-fit mx-auto flex gap-2 flex-row",
          "rounded-full mr-0 p-2 border-2",
          "border-[#626262] bg-transparent",
        ])}
      >
        {topBarArr.map((item) => (
          <div key={item.name} className="bg-[#606060] p-2 px-4 rounded-full">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="text-center">
      <h1 className="text-8xl w-fit mx-auto font-black flex flex-row gap-6">
        <p>Meet</p>
        <Emoji className="w-[100px] h-[100px]" name="chat" />
        <p>Waifuu</p>
      </h1>

      <Spacer y={5} />

      <h2 className="w-fit mx-auto text-5xl flex flex-row gap-2">
        <p className="font-light">The virtual</p>
        <p className="text-gray-400 font-bold">friend</p>
      </h2>

      <Spacer y={20} />
      <button className="mx-auto border-2 flex flex-row gap-2 bg-[#8D8D8D] bg-opacity-20 px-10 border-[#A0A0A0] rounded-full p-2">
        <Emoji name="sparkles" className="h-7 w-7" />
        <p className="mt-0.5 font-semibold">Try it out</p>
      </button>

      <Spacer y={96} />
    </header>
  );
};

const Features = () => {
  return (
    <div className="w-fit mx-auto">
      <div className="flex flex-row gap-3">
        <Image width={300} height={200} alt="Feature 1" src="/assets/feature1.png" />
        <div className="mt-24">
          <h1 className="font-bold text-3xl">Always with you</h1>
          <p className="w-[400px]">
            Waifuu is there 24/7 with you, he sometimes sends you message by himself, it simply
            feels real.
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-3">
        <Image width={300} height={200} alt="Feature 2" src="/assets/feature2.png" />
        <div className="mt-24">
          <h1 className="font-bold text-3xl">Always with you</h1>
          <p className="w-[400px]">
            Waifuu is there 24/7 with you, he sometimes sends you message by himself, it simply
            feels real.
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-3">
        <Image width={300} height={200} alt="Feature 3" src="/assets/feature3.png" />
        <div className="mt-24">
          <h1 className="font-bold text-3xl">Always with you</h1>
          <p className="w-[400px]">
            Waifuu is there 24/7 with you, he sometimes sends you message by himself, it simply
            feels real.
          </p>
        </div>
      </div>
    </div>
  );
};

const PayPlans = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center">🛒 Pay only for what you need</h1>

      <Spacer y={10} />
      <div className="flex flex-row gap-6 w-fit mx-auto">
        <div className="p-4 border-gray-500 border-2 rounded-xl">
          <Emoji className="h-10 w-10 mx-auto" name="money" />
          <h1 className="text-2xl text-center font-bold">Money</h1>
          <p className="text-center w-96">
            Pro tier is for people that want to chat all-day long, maximal quota is almost
            infinite
          </p>
          <Spacer y={2} />
          <div className="rounded-xl bg-[#292929] text-center p-3">
            <div className="flex flex-row gap-2 w-fit font-bold text-3xl mx-auto">
              <p className="text-gray-400 line-through">15$</p>
              <p className="text-white">13$</p>
            </div>
            <Spacer y={2} />
            <button className="bg-[#1A1A1A] p-2 rounded-full px-5">Choose tier</button>
            <Spacer y={2} />
            <p>*You will be billed 13$ per month</p>
          </div>
        </div>

        <div className="p-4 bg-[#222222] rounded-xl">
          <Emoji className="mx-auto h-10 w-10" name="gem" />
          <h1 className="text-2xl text-center font-bold">Pro</h1>
          <p className="text-center w-96">
            Starter is a perfect tier if you're not big chatting person.
          </p>
          <Spacer y={2} />
          <div className="rounded-xl bg-[#464646] text-center p-3">
            <div className="flex flex-row gap-2 w-fit font-bold text-3xl mx-auto">
              <p className="text-gray-400 line-through">15$</p>
              <p className="text-white">13$</p>
            </div>
            <Spacer y={2} />
            <button className="bg-[#7C7C7C] p-2 rounded-full px-5">Choose tier</button>
            <Spacer y={2} />
            <p>*You will be billed 13$ per month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const WaifuuUsageCard = ({ specialClass }: { specialClass?: string }) => {
  return (
    <div className={twMerge(["w-[230px] bg-gray-600 h-[150px] rounded-lg", specialClass])}>
      <div
        className={twMerge([
          "relative -bottom-28 -right-32 bg-red-500 rounded-lg w-fit",
          "flex flex-row gap-2 text-lg font-bold p-2",
        ])}
      >
        <Emoji className="h-7 w-7" name="blossom" />
        Roleplay
      </div>
    </div>
  );
};

const CompanionUsage = () => {
  return (
    <div>
      <div className="flex w-fit mx-auto flex-row gap-60 mb-9">
        <WaifuuUsageCard specialClass="mt-16" />
        <WaifuuUsageCard />
        <WaifuuUsageCard specialClass="mt-16" />
      </div>

      <div className="w-fit text-5xl text-center mx-auto">
        <h1 className="flex flex-row gap-2">
          <Emoji name="blossom" className="w-[50px] h-[50px]" />
          <p>Waifuu</p>
        </h1>
        <p className="font-bold">can do</p>
      </div>

      <div className="flex w-fit mx-auto flex-row gap-60 mt-9">
        <WaifuuUsageCard />
        <WaifuuUsageCard specialClass="mt-16" />
        <WaifuuUsageCard />
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="text-center">
      <p className="font-bold text-lg text-gray-400">Trusted by 1000+ users</p>
      <div className="w-fit mx-auto flex text-4xl font-bold flex-row gap-2">
        <h1>Let's begin</h1>
        <Emoji name="sparkles" />
        <h1>your journey</h1>
      </div>

      <div className="flex flex-row gap-2 w-fit mx-auto mt-2">
        <Image
          alt="Google play download"
          src="/assets/gpdownload.png"
          width={200}
          height={200}
        />
        <Image
          alt="Apple store download"
          src="/assets/apdownload.svg"
          width={160}
          height={150}
        />
      </div>

      <h3 className="font-bold">Or</h3>
      <Spacer y={3} />

      <button className="bg-gray-500 flex flex-row gap-2 mx-auto px-8 font-semibold p-3 rounded-full">
        <Emoji name="globe" className="h-7 w-7" />
        Open web app
      </button>
    </footer>
  );
};

export default process.env.NEXT_PUBLIC_BUILDING_NATIVE
  ? Discover
  : function LandingPage() {
      // const { status } = useSession();
      // const router = useRouter();

      // React.useEffect(() => {
      //   if (status === "authenticated") router.push(semanticPaths.appIndex);
      // }, [status]);

      // Todo: meta description.
      return (
        <PublicPage
          className="bg-background text-white bg-contain bg-no-repeat"
          title={"Meet Waifuu"}
          /*TODO: DESCRIPTION*/
          description={""}
        >
          <Nav />

          <Spacer y={40} />
          <Header />
          <Spacer y={40} />
          <Features />
          <Spacer y={40} />
          {/*<PayPlans />*/}
          <Spacer y={40} />
          {/*<CompanionUsage />*/}
          <Spacer y={40} />
          <Footer />
          <Spacer y={40} />
        </PublicPage>
      );
    };

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [activeHref, setActiveHref] = React.useState<string>(paths.index);
  const router = useRouter();

  useEffect(() => {
    if (!router?.isReady) return;
    setActiveHref(router.pathname);
  }, [router, router.pathname]);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarBrand>
        <div>logo here</div>
        <p className="font-bold text-inherit">Waifuu</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {publicNavbarPaths.map((path) => {
          const isActive = activeHref.includes(path.href);
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
        {publicNavbarPaths.map((path) => {
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
    </Navbar>
  );
};
