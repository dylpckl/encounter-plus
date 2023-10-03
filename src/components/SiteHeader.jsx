"use client";
import { Fragment, useState, useRef, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { usePathname } from "next/navigation";
import useOnClickOutside from "@/lib/hooks/useOnClickOutside";

export default function SiteHeader({ encounters }) {
  // console.log(encounters);
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
