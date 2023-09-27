"use client";

import { Fragment, useState, useEffect } from "react";
import { CheckIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import useDebounce from "@/lib/hooks/useDebounce";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// click monsters, add to batch, confirm to add them to combat
// onChange={batchMonsters}
//   function batchMonsters(monster) {
// setMonstersToAdd([...monstersToAdd, monster]);
// }

function addActiveMonsters() {
  setAddMonstersOpen(false);
  monstersToAdd.map((monster) => {
    setActiveMonsters((prev) => [
      ...prev,

      {
        ...monster,
        maxHP: monster.hit_points,
        active: false,
        init: rollInitiative(monster.dexterity),
        id: nanoid(),
        type: "monster",
        conditions: {
          BLND: false,
          CHRM: false,
          DEAF: false,
          FRGHT: false,
          GRPL: false,
          INCAP: false,
          INVIS: false,
          PRLZ: false,
          PETR: false,
          POIS: false,
          PRNE: false,
          REST: false,
          STUN: false,
          UNCON: false,
        },
      },
    ]);
  });
  setMonstersToAdd([]);
}

export default function AddMonster({ open, setOpen }) {
  const [query, setQuery] = useState("");
  //   const [open, setOpen] = useState(true);
  const [monsterResults, setMonsterResults] = useState("");
  const debouncedSearch = useDebounce(query);
  const [selectedMonsters, setSelectedMonsters] = useState([]);

  const fetchMonsters = async (value) => {
    const variables = { name: value };
    const res = await fetch("/api/monsters", {
      method: "POST",
      body: JSON.stringify({ variables: variables }),
    });
    const data = await res.json();
    setMonsterResults(data);
  };

  useEffect(() => {
    if (query) {
      fetchMonsters(query);
    } else {
      setMonsterResults([]);
    }
  }, [debouncedSearch]);

  //   const filteredPeople =
  //     query === ""
  //       ? []
  //       : people.filter((person) => {
  //           return person.name.toLowerCase().includes(query.toLowerCase());
  //         });

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Dialog.Title
                as="h3"
                className="text-base font-semibold leading-6 text-gray-900 px-2 py-3"
              >
                Add Monsters to encounter_name
              </Dialog.Title>

              <Combobox
                value={selectedMonsters}
                onChange={setSelectedMonsters}
                multiple
              >
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="w-full rounded-md border-0 bg-gray-100 pl-12 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm"
                    placeholder="Search for a monster..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                {monsterResults.length > 0 && (
                  <Combobox.Options
                    static
                    className="-mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                  >
                    {monsterResults.map((monster) => (
                      <Combobox.Option
                        key={monster.id}
                        value={monster}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none rounded-md px-4 pl-8 py-2",
                            active && "bg-indigo-600 text-white"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={classNames(
                                "block truncate",
                                selected && "font-semibold"
                              )}
                            >
                              {monster.name}
                            </span>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                  active ? "text-white" : "text-indigo-600"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                      // <Combobox.Option
                      //   key={monster.id}
                      //   value={monster}
                      //   as={Fragment}
                      // >
                      //   {({ active, selected }) => (
                      //     <li
                      //       className={`${
                      //         active
                      //           ? "bg-blue-500 text-white"
                      //           : "bg-white text-black"
                      //       }`}
                      //     >
                      //       {selected && <CheckIcon className="h-5 w-5" />}
                      //       {monster.name}
                      //     </li>
                      //   )}
                      // </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}

                {query !== "" && monsterResults.length === 0 && (
                  <div className="px-4 py-14 text-center sm:px-14">
                    <UsersIcon
                      className="mx-auto h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                    <p className="mt-4 text-sm text-gray-900">
                      No people found using that search term.
                    </p>
                  </div>
                )}
              </Combobox>

              {selectedMonsters.length > 0 && (
                <ul
                  role="list"
                  className="divide-y divide-gray-100 text-gray-400"
                >
                  {selectedMonsters.map((monster) => (
                    <li
                      key={monster.name}
                      className=""
                    >
                      {monster.name}
                    </li>
                  ))}
                </ul>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
