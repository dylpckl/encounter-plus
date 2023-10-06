"use client";
import { Fragment, useState, useRef, useEffect } from "react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { usePathname } from "next/navigation";
import useOnClickOutside from "@/lib/hooks/useOnClickOutside";

import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader({ encounters }) {
  // console.log(encounters);
  const [placeholder, setPlaceholder] = useState("Search");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  // const [open, setOpen] = useState(false);
  // const sidebarRef = useRef(null);
  // useOnClickOutside(sidebarRef, () => setSidebarOpen(false));
  // https://www.youtube.com/watch?v=-I5P0J_Tv80

  const pathname = usePathname();

  async function createEncounter() {
    const newEncounterRef = await addDoc(collection(db, "encounters"), {
      title: "new",
      roundCtr: 1,
      turnCtr: 1,
      combatActive: false,
    });
    router.refresh();
    router.push(`/e/${newEncounterRef.id}`);
    setSidebarOpen(false);
  }

  const Sidebar = () => {
    return (
      <Transition
        show={sidebarOpen}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-auto"
          onClose={() => setSidebarOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-50" />
          </Transition.Child>

          {/* Sidebar */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition duration-300 ease-out transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="h-full w-64 relative z-10 bg-gray-50 text-black">
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                      Panel title
                    </Dialog.Title>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex flex-1 px-4 sm:px-6">
                  <nav className="flex flex-1 flex-col">
                    <ul
                      role="list"
                      className="-mx-2 space-y-1"
                    >
                      {encounters.map((encounter) => {
                        const isActive = pathname === `/e/${encounter.id}`;

                        // console.log(pathname, isActive);
                        return (
                          <li key={encounter.id}>
                            <Link
                              href={`/e/${encounter.id}`}
                              className={
                                isActive ? "text-red-500" : "text-black"
                              }
                            >
                              {encounter.title}
                            </Link>
                          </li>
                        );
                      })}
                      <div className="mt-6 bg-sky-300">
                        <button onClick={createEncounter}>create new</button>
                      </div>
                    </ul>
                  </nav>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    );
  };

  const navigation = [
    { name: "Projects", href: "#", icon: FolderIcon, current: false },
    { name: "Deployments", href: "#", icon: ServerIcon, current: false },
    { name: "Activity", href: "#", icon: SignalIcon, current: false },
    { name: "Domains", href: "#", icon: GlobeAltIcon, current: false },
    { name: "Usage", href: "#", icon: ChartBarSquareIcon, current: false },
    { name: "Settings", href: "#", icon: Cog6ToothIcon, current: true },
  ];
  const teams = [
    { id: 1, name: "Planetaria", href: "#", initial: "P", current: false },
    { id: 2, name: "Protocol", href: "#", initial: "P", current: false },
    { id: 3, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  ];
  const secondaryNavigation = [
    { name: "Account", href: "#", current: true },
    { name: "Notifications", href: "#", current: false },
    { name: "Billing", href: "#", current: false },
    { name: "Teams", href: "#", current: false },
    { name: "Integrations", href: "#", current: false },
  ];

  const SidebarTest = () => {
    return (
      <Transition.Root
        show={sidebarOpen}
        as={Fragment}
        appear
      >
        <Dialog
          as="div"
          className="relative z-50 xl:hidden"
          onClose={setSidebarOpen}
          // onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-1000"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-1000"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-1000 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-1000 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1 transition-all">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-5000"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-5000"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  appear
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul
                      role="list"
                      className="flex flex-1 flex-col gap-y-7"
                    >
                      <li>
                        <ul
                          role="list"
                          className="-mx-2 space-y-1"
                        >
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">
                          Your teams
                        </div>
                        <ul
                          role="list"
                          className="-mx-2 mt-2 space-y-1"
                        >
                          {teams.map((team) => (
                            <li key={team.name}>
                              <a
                                href={team.href}
                                className={classNames(
                                  team.current
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                  {team.initial}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="-mx-6 mt-auto">
                        <a
                          href="#"
                          className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                        >
                          <img
                            className="h-8 w-8 rounded-full bg-gray-800"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                          <span className="sr-only">Your profile</span>
                          <span aria-hidden="true">Tom Cook</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };

  const Test = () => {
    return (
      <Transition.Root
        show={sidebarOpen}
        as={Fragment}
        afterLeave={() => {
          setQuery("");
          setSelectedMonsters([]);
        }}
        appear
      >
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-1000"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-1000"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-1000"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-1000"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-3xl transform rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Dialog.Title
                  as="h3"
                  className="flex justify-between text-base font-semibold leading-6 text-gray-900 px-4 py-5"
                >
                  Add Monsters to test
                  {/* <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button> */}
                </Dialog.Title>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };

  return (
    <>
      <header className="flex items-center w-full col-span-full bg-slate-400 h-12">
        <button onClick={() => setSidebarOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
        <span>e+</span>
        <Sidebar />
      </header>
    </>
  );
}
