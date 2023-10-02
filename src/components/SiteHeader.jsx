"use client";
import { Fragment, useState, useRef, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";

import useOnClickOutside from "@/lib/hooks/useOnClickOutside";

export default function SiteHeader({ encounters }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const [open, setOpen] = useState(false);
  // const sidebarRef = useRef(null);
  // useOnClickOutside(sidebarRef, () => setSidebarOpen(false));
  // https://www.youtube.com/watch?v=-I5P0J_Tv80
  const Sidebar = () => {
    // useEffect(() => {
    //   setSidebarOpen(false);
    // }, [setSidebarOpen]);
    return (
      <Transition
        show={sidebarOpen}
        as={Fragment}
        appear
        unmount={false}
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
            appear
            unmount={false}
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
            appear
            unmount={false}
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
                  {/* {encounters.map((e) => (
                    <li>{e.id}</li>
                  ))} */}
                  <Link
                    href="/e/1"
                    onClick={() => setSidebarOpen(false)}
                  >
                    encounter1
                  </Link>
                  {/* <button onClick={setSidebarOpen(false)}>
                  </button> */}
                  <div className="">

                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    );
  };

  const SidebarTest = () => {
    return (
      <Transition.Root
        show={open}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-40"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
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
                              onClick={() => setOpen(false)}
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
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Your content */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
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
      {/* {sidebarOpen && <Sidebar />} */}
      {/* <Sidebar /> */}
    </>
  );
}
