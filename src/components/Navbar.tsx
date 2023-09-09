import Image from "next/image";
import { FaBell } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-transparent">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <Image
            className="h-20 w-auto"
            src="/assets/logo.png"
            width={100}
            height={50}
            alt="Your Company"
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="flex flex-row gap-5">
              <button
                type="button"
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <FaBell color="white" fontSize={30} />
              </button>

              <button
                type="button"
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">Open user menu</span>
                <Image
                  className="h-8 w-8 rounded-full"
                  src="/assets/default_user.jpg"
                  height={50}
                  width={100}
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
