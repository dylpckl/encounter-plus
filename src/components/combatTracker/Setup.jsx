import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  HeartIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  UserPlusIcon,
  BugAntIcon,
  MinusCircleIcon,
} from "@heroicons/react/20/solid";

import {
  //   BugAntIcon,
  EllipsisHorizontalIcon,
  //   MinusCircleIcon,
  //   UserPlusIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// add mon
// add char
// clear

// const actions = [
//   {
//     name: "Projects",
//     href: "#",
//     icon: BugAntIcon,
//     onClick: onAddMonsters,
//     current: false,
//   },
//   {
//     name: "Deployments",
//     href: "#",
//     icon: UserPlusIcon,
//     onClick: onAddCharacters,
//     current: false,
//   },
//   {
//     name: "Activity",
//     href: "#",
//     icon: MinusCircleIcon,
//     onClick: onClearInitiative,
//     current: false,
//   },
//   // { name: "Domains", href: "#", icon: GlobeAltIcon, current: false },
//   // { name: "Usage", href: "#", icon: ChartBarSquareIcon, current: false },
//   // { name: "Settings", href: "#", icon: Cog6ToothIcon, current: true },
// ];

export default function Example({
  onAddMonsters,
  onAddCharacters,
  onClearInitiative,
}) {
  // const items = [
  //   {
  //     name: "Add Monsters",
  //     onClick: onAddMonsters,
  //     icon: (
  //       <BugAntIcon
  //         className="mr-3 h-5 w-5 group-hover:text-gray-500"
  //         aria-hidden="true"
  //       />
  //     ),
  //   },
  //   // {
  //   //   name: "Add Characters",
  //   //   onClick: onAddCharacters,
  //   //   icon: (
  //   //     <UserPlusIcon
  //   //       className="mr-3 h-5 w-5 group-hover:text-gray-500"
  //   //       aria-hidden="true"
  //   //     />
  //   //   ),
  //   // },
  //   // {
  //   //   name: "Restart",
  //   //   onClick: onRestartCombat,

  //   //   icon: (
  //   //     <ArrowPathIcon
  //   //       className="mr-3 h-5 w-5 group-hover:text-gray-500"
  //   //       aria-hidden="true"
  //   //     />
  //   //   ),
  //   // },
  //   // {
  //   //   name: "Clear Initiative",
  //   //   onClick: onClearInitiative,
  //   //   icon: (
  //   //     <MinusCircleIcon
  //   //       className="mr-3 h-5 w-5 group-hover:text-gray-500"
  //   //       aria-hidden="true"
  //   //     />
  //   //   ),
  //   // },
  // ];

  const actions = [
    {
      name: "Add Monsters",
      href: "#",
      icon: BugAntIcon,
      onClick: onAddMonsters,
      current: false,
    },
    {
      name: "Add Characters",
      href: "#",
      icon: UserPlusIcon,
      onClick: onAddCharacters,
      current: false,
    },
    {
      name: "Clear Initiative",
      href: "#",
      icon: MinusCircleIcon,
      onClick: onClearInitiative,
      current: false,
    },
    {
      name: "Reset Initiative",
      href: "#",
      icon: ArrowPathIcon,
      onClick: onClearInitiative,
      current: false,
    },
    // { name: "Domains", href: "#", icon: GlobeAltIcon, current: false },
    // { name: "Usage", href: "#", icon: ChartBarSquareIcon, current: false },
    // { name: "Settings", href: "#", icon: Cog6ToothIcon, current: true },
  ];

  return (
    <Menu
      as="div"
      className="relative inline-block text-left h-6"
    >
      <Menu.Button className="inline-flex justify-center items-center font-semibold">
        {/* <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"> */}
        {/* Setup */}
        <EllipsisHorizontalIcon
          className="-mr-1 h-6 w-6 text-slate-100"
          aria-hidden="true"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {/* <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <PencilSquareIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Edit
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <DocumentDuplicateIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Duplicate
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <ArchiveBoxIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Archive
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <ArrowRightCircleIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Move
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <UserPlusIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Share
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <HeartIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Add to favorites
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Delete
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items> */}
        <Menu.Items className="absolute right-0 z-10 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {actions.map((action, idx, array) => (
              <Fragment key={action.name}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={action.onClick}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "w-full group flex items-center px-4 py-2 text-sm"
                      )}
                    >
                      {/* {action.icon && (
                        <span className="mr-2">{action.icon}</span>
                      )}
                      {action.name} */}
                      <action.icon
                        className="mr-3 h-5 w-5 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      {action.name}
                    </button>
                  )}
                </Menu.Item>
                {idx === 1 && (
                  <div className="border-t border-gray-200 my-1.5" />
                )}
              </Fragment>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
