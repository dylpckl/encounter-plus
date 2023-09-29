"use client";

import { Fragment, useState, useEffect } from "react";
import { nanoid } from "nanoid";

import {
  CheckIcon,
  MinusIcon,
  MinusSmallIcon,
  PlusIcon,
  PlusSmallIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";
import useDebounce from "@/lib/hooks/useDebounce";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TEST = [
  { id: 1, name: "monster", armorClass: 14, hitPoints: 30, qty: 1 },
  { id: 2, name: "monster", armorClass: 14, hitPoints: 30, qty: 1 },
];

// multiple selections; two options:
// 1. use out-of-box Combobox onChange
// - pros: checkboxes show, unclick to remove
// - cons: need to add secondary state to intercept and manage name, qty, etc
// 2. handle it manually
// - pros: avoid secondary state complications
// - cons: need to do everything manually:
//    - [x] style monster results depening on selected (add id to api results)
//    - [ ] re-click monster result to remove from selected
//    -
//    -

export default function AddMonster({ open, setOpen, onAddMonsters }) {
  const [query, setQuery] = useState("");
  const [monsterResults, setMonsterResults] = useState("");
  const [selectedMonsters, setSelectedMonsters] = useState(TEST);
  const debouncedSearch = useDebounce(query);

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

  function handleSelectMonster(monster) {
    // Select monster if not already selected (compare by name)

    setSelectedMonsters((prev) =>
      prev.some((m) => m.name === monster.name)
        ? prev
        : [...prev, { ...monster, id: nanoid(), qty: 1 }]
    );

    // setSelectedMonsters(
    //   selectedMonsters.map((m) => {
    //     if (m.name === monster.name) {
    //       return m;
    //     }
    //     return { ...monster, id: nanoid(), qty: 1 };
    //   })
    // );

    // setSelectedMonsters((prev) => [
    //   ...prev,
    //   { ...monster, id: nanoid(), qty: 1 },
    // ]);
  }

  function updateQty(monster, action, newValue = null) {
    // accepts "inc" or "dec" or "set" as action

    // qty buttons only visible after selecting a monster, so the monster will definitely
    // be in the selectedMonsters array
    const monsterIndex = selectedMonsters.findIndex(
      (selectedMonster) => selectedMonster.name === monster.name
    );

    if (monsterIndex !== -1) {
      let newQty;

      // https://react.dev/learn/updating-arrays-in-state#updating-objects-inside-arrays
      setSelectedMonsters(
        selectedMonsters.map((m) => {
          if (m.name === monster.name) {
            newQty = m.qty;
            if (action === "dec") {
              newQty -= 1;
              if (newQty < 1) {
                newQty = 1;
              }
            } else if (action === "inc") {
              newQty += 1;
            } else if (action === "set" && newValue !== null) {
              // Prevent negative values when setting a new value
              newQty = Math.max(newValue, 0);
            }
            return { ...m, qty: newQty };
          }
          return m;
        })
      );

      return newQty;

      // KEEP ME -----------------------------
      // setSelectedMonsters(
      //   selectedMonsters.map((m) => {
      //     if (m.name === monster.name) {
      //       return { ...m, qty: (monster.qty += 1) };
      //     }
      //     return m;
      //   })
      // );
    }
  }

  function handleQtyChange(event, monster) {
    // console.log(event.target.value, monster);
    const newValue = parseInt(event.target.value, 10); // Parse the input value as an integer
    if (!isNaN(newValue)) {
      // Check if the newValue is a valid number
      updateQty(monster, "set", newValue);
      // updateQty will handle the state update for us
    }
  }

  function handleNameChange(event, monster) {
    // console.log(selectedMonsters, monster);
    const newName = event.target.value;
    setSelectedMonsters(
      selectedMonsters.map((m) => {
        if (m.id !== monster.id) {
          return m;
        }
        return { ...m, name: newName };
      })
    );
  }

  function handleManualEntry() {
    // add new monster to selected monsters
    setSelectedMonsters([
      ...selectedMonsters,
      {
        name: query,
        armorClass: null,
        hitPoints: null,
        qty: 1,
      },
    ]);
  }

  function handleDelete(monster) {
    setSelectedMonsters((prev) => prev.filter((m) => m.id !== monster.id));
    // setSelectedMonsters(
    //   selectedMonsters.filter((m) => {
    //     m.id !== monster.id;
    //   })
    // );
  }

  return (
    <Transition.Root
      show={open}
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
            <Dialog.Panel className="mx-auto max-w-3xl transform rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Dialog.Title
                as="h3"
                className="flex justify-between text-base font-semibold leading-6 text-gray-900 px-4 py-5"
              >
                Add Monsters to encounter_name
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

              <Combobox
                value={selectedMonsters}
                // onChange={setSelectedMonsters}
                // onChange={(monsters) => {
                //   // console.dir(e);
                //   setSelectedMonsters(prev=>[...prev, monsters);
                // }}
                // // onChange={
                // // }
                multiple
              >
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-6 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="w-full rounded-md border-0 bg-gray-100 pl-12 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm mx-4"
                    placeholder="Search for a monster..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-6"
                  >
                    <XMarkIcon
                      className="pointer-events-none  h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                {monsterResults.length > 0 && (
                  <Combobox.Options
                    static
                    className="mx-4 -mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                  >
                    {monsterResults.map((monster, idx) => (
                      <Combobox.Option
                        key={idx}
                        value={monster}
                        // onClick={() => selectMonster(monster)}
                        onClick={() =>
                          // setSelectedMonsters((prev) => [
                          //   ...prev,
                          //   { ...monster, qty: 1 },
                          // ])
                          handleSelectMonster(monster)
                        }
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
                              {monster.id}
                            </span>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                  active ? "text-white" : "text-indigo-600"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5 text-black"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
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
                      No monsters found using that search term.
                    </p>
                    <button
                      onClick={handleManualEntry}
                      type="button"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      manual entry
                    </button>
                  </div>
                )}
              </Combobox>

              {selectedMonsters.length > 0 && (
                <div className="mt-8 flow-root">
                  {/* <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8"> */}
                  <div className="inline-block min-w-full py-2 align-middle">
                    <table className="min-w-full border-separate border-spacing-0">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="sticky top-0 z-10 text-center border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter "
                          >
                            AC
                          </th>
                          <th
                            scope="col"
                            className="sticky top-0 z-10 text-center border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter "
                          >
                            HP
                          </th>
                          <th
                            scope="col"
                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMonsters.map((monster, monsterIdx) => (
                          <tr key={monster.id}>
                            <td
                              className={classNames(
                                monsterIdx !== selectedMonsters.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                              )}
                            >
                              <input
                                type="email"
                                name="email"
                                id="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="you@example.com"
                                defaultValue={monster.name}
                                onChange={(e) => handleNameChange(e, monster)}
                              />
                            </td>
                            <td
                              className={classNames(
                                monsterIdx !== selectedMonsters.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                              )}
                            >
                              <input
                                type="email"
                                name="email"
                                id="email"
                                className="block w-12 rounded-md border-0 py-1.5 mx-auto text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="you@example.com"
                                defaultValue={monster.armorClass}
                                // onChange={(e) => handleNameChange(e, monster)}
                              />
                            </td>
                            <td
                              className={classNames(
                                monsterIdx !== selectedMonsters.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                              )}
                            >
                              <input
                                type="email"
                                name="email"
                                id="email"
                                className="block w-12 rounded-md border-0 py-1.5 mx-auto text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="you@example.com"
                                defaultValue={monster.hitPoints}
                                // onChange={(e) => handleNameChange(e, monster)}
                              />
                            </td>
                            <td
                              className={classNames(
                                monsterIdx !== selectedMonsters.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "whitespace-nowrap px-3 py-4 text-sm text-gray-500 mx-auto flex gap-2 justify-center"
                              )}
                            >
                              <button
                                onClick={() => updateQty(monster, "dec")}
                                className="w-9 h-9 text-center rounded-full bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <MinusSmallIcon className="w-4 h-4" />
                              </button>
                              <input
                                type="text"
                                // defaultValue={monster.qty}
                                value={monster.qty}
                                onChange={(e) => handleQtyChange(e, monster)}
                                className="w-12 rounded-md border-0 py-1.5 text-gray-900 text-center shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              <button
                                onClick={() => updateQty(monster, "inc")}
                                className="w-9 h-9 text-center rounded-full bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <PlusSmallIcon className="w-4 h-4" />
                              </button>
                            </td>
                            <td
                              className={classNames(
                                monsterIdx !== selectedMonsters.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "relative whitespace-nowrap py-4 text-right w-12 text-sm font-medium sm:pr-6 lg:pr-8"
                              )}
                            >
                              <button
                                onClick={() => handleDelete(monster)}
                                className="text-rose-600 hover:text-rose-900"
                              >
                                Delete
                                <span className="sr-only">
                                  , {monster.name}
                                </span>
                              </button>
                            </td>
                            {/* <td
                                className={classNames(
                                  personIdx !== people.length - 1
                                    ? "border-b border-gray-200"
                                    : "",
                                  "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                )}
                              >
                                {person.role}
                              </td>
                             */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* </div> */}
                </div>
                // <div className="max-h-72 overflow-y-auto">
                //   <div className="flex w-full">
                //     <div className="flex items-center gap-2 p-4 w-2/3">
                //       <span className="block w-full text-sm font-medium leading-6 text-gray-900">
                //         name
                //       </span>
                //       <span className="block w-12 text-sm font-medium leading-6 text-gray-900">
                //         ac
                //       </span>
                //       <span className="block w-12 text-sm font-medium leading-6 text-gray-900">
                //         hp
                //       </span>
                //     </div>

                //     <div className="w-1/3 justify-end">
                //       <span className="block w-12 text-sm font-medium leading-6 text-gray-900">
                //         qty
                //       </span>
                //     </div>
                //   </div>
                //   <ul
                //     role="list"
                //     className="divide-y divide-gray-100 text-gray-400 p-4"
                //   >
                //     {selectedMonsters.map((monster) => (
                //       <li
                //         key={monster.name}
                //         className="flex items-center justify-between py-2"
                //       >
                //         <div className="flex gap-2 w-2/3">
                //           <input
                //             type="email"
                //             name="email"
                //             id="email"
                //             className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                //             placeholder="you@example.com"
                //             value={monster.name}
                //             onChange={(e) => handleNameChange(e, monster)}
                //           />

                //           <input
                //             type="email"
                //             name="email"
                //             id="email"
                //             className="block w-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                //             placeholder="you@example.com"
                //             value={monster.armorClass}
                //             // onChange={(e) => handleNameChange(e, monster)}
                //           />

                //           <input
                //             type="email"
                //             name="email"
                //             id="email"
                //             className="block w-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                //             placeholder="you@example.com"
                //             value={monster.hitPoints}
                //             // onChange={(e) => handleNameChange(e, monster)}
                //           />
                //         </div>

                //         <div className="flex gap-2 w-1/3 justify-end">
                //           <button
                //             onClick={() => updateQty(monster, "dec")}
                //             className="w-9 h-9 text-center rounded-full bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                //           >
                //             <MinusSmallIcon className="w-4 h-4" />
                //           </button>
                //           <input
                //             type="text"
                //             // defaultValue={monster.qty}
                //             value={monster.qty}
                //             onChange={(e) => handleQtyChange(e, monster)}
                //             className="w-12 rounded-md border-0 py-1.5 text-gray-900 text-center shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                //           />
                //           <button
                //             onClick={() => updateQty(monster, "inc")}
                //             className="w-9 h-9 text-center rounded-full bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                //           >
                //             <PlusSmallIcon className="w-4 h-4" />
                //           </button>
                //         </div>
                //       </li>
                //     ))}
                //   </ul>
                // </div>
              )}

              {/* Footer */}
              <div className="flex bg-gray-50 gap-4 px-4 py-3 mt-4 text-center rounded-b-xl">
                <button
                  type="button"
                  className="w-1/2 mt-3 inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onAddMonsters(selectedMonsters)}
                  disabled={selectedMonsters.length === 0 ? true : false}
                  className="w-1/2 inline-flex text-center justify-center capitalize gap-x-1.5 rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-300 transition-colors"
                >
                  <CheckCircleIcon
                    className="-ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  add monsters
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
