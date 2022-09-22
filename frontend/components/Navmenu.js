import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import joinClassNames from "../utils/joinClassNames";
import { useNetwork } from 'wagmi'
import { RiArrowDownSLine } from "react-icons/ri";


  export default function Navmenu ( )
  {
   const { chain, chains } = useNetwork()
  return (
    <Menu as="div" className="relative z-10 inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center px-2.5 py-2 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 w-32 cursor-pointer">
          <span className="w-5 h-3 mr-1 bg-indigo-400 rounded-full"></span>
          { chain && <p className="text-ellipsis">{ chain.name }</p> }
          <RiArrowDownSLine size={30} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ account }) => (
                <a
                  href={`/my-rsvps/upcoming`}
                  className={joinClassNames(
                    account ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  My RSVPs
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ account }) => (
                <a
                  href={`/my-events/upcoming`}
                  className={joinClassNames(
                    account ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  My Events
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
