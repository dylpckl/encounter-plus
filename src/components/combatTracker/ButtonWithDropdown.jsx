import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  BugAntIcon,
  MinusCircleIcon,
  PlayIcon,
  StopIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({
  combatActive,
  setCombatActive,
  onAddMonsters,
  onAddCharacters,
  onRestartCombat,
  onClearInitiative,
}) {
  const items = [
    {
      name: "Add Monsters",
      onClick: onAddMonsters,
      icon: (
        <BugAntIcon
          className="mr-3 h-5 w-5 group-hover:text-gray-500"
          aria-hidden="true"
        />
      ),
    },
    {
      name: "Add Characters",
      onClick: onAddCharacters,
      icon: (
        <UserPlusIcon
          className="mr-3 h-5 w-5 group-hover:text-gray-500"
          aria-hidden="true"
        />
      ),
    },
    {
      name: "Restart",
      onClick: onRestartCombat,

      icon: (
        <ArrowPathIcon
          className="mr-3 h-5 w-5 group-hover:text-gray-500"
          aria-hidden="true"
        />
      ),
    },
    {
      name: "Clear Initiative",
      onClick: onClearInitiative,
      icon: (
        <MinusCircleIcon
          className="mr-3 h-5 w-5 group-hover:text-gray-500"
          aria-hidden="true"
        />
      ),
    },
  ];

  return (
    <div className="inline-flex rounded-md shadow-sm">
      <button
        type="button"
        onClick={setCombatActive}
        className="relative inline-flex items-center gap-x-1.5 rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      >
        <PlayIcon
          className="-ml-0.5 h-5 w-5"
          aria-hidden="true"
        />
        Start Encounter
      </button>
      <Menu
        as="div"
        className="relative -ml-px block"
      >
        <Menu.Button className="relative inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
          <span className="sr-only">Open options</span>
          <ChevronDownIcon
            className="h-5 w-5"
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
          <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {items.map((item, idx, array) => (
                <Fragment key={item.name}>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={item.onClick}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "w-full group flex items-center px-4 py-2 text-sm"
                        )}
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.name}
                      </button>
                    )}
                  </Menu.Item>
                  {/* {idx < array.length - 2 && (
                    <div className="border-t border-gray-200 py-1.5" />
                  )} */}
                </Fragment>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
