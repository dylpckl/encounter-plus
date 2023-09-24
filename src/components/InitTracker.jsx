"use client";

// External
import {
  Fragment,
  useState,
  useEffect,
  useRef,
  forwardRef,
  Suspense,
} from "react";
import { nanoid } from "nanoid";
import { Dialog, Transition, Switch } from "@headlessui/react";
import clsx from "clsx";

// Components
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import MonsterCard from "@/components/MonsterCard";
import HitPointPopover from "@/components/HitPointPopover";
import CharacterInputs from "@/components/CharacterInputs";

// Utils
import rollInitiative from "@/lib/rollInitiative";
import useDebounce from "@/lib/hooks/useDebounce";

// Icons
import {
  ClockIcon,
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  XMarkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { type } from "os";

function filterMonsters(monsters, query) {
  query = query.toLowerCase();
  return monsters.filter((mon) =>
    mon.name.split(" ").some((word) => word.toLowerCase().startsWith(query))
  );
}

function debounce(func, delay) {
  let timerId;

  return function (...args) {
    const context = this;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// type Monster = {
//   name: string;
//   dexterity: number;
//   armor_class: { value: number }[];
//   hit_points: number;
//   damage_immunities: string[]; // Assuming it's an array of strings
//   damage_resistances: string[]; // Assuming it's an array of strings
//   damage_vulnerabilities: string[]; // Assuming it's an array of strings
//   proficiencies: {
//     // Define the structure of the proficiencies property if needed
//   }[];
//   maxHP: number;
//   active: boolean;
//   init: number;
//   id: string;
//   conditions: {};
// };

// type Character = {
//   name: string;
//   armorClass: number;
//   id: string;
//   init: Number;
// };

const CHARACTERS = [
  {
    id: 1,
    name: "Strongheart",
    armorClass: 17,
  },
  {
    id: 2,
    name: "Elkhorn",
    armorClass: 11,
  },
];

export default function Home() {
  // State
  const [query, setQuery] = useState("");
  // const [addMonstersOpen, setAddMonstersOpen] = useState(false);

  const [manageCharactersOpen, setManageCharactersOpen] = useState(false);
  const [characters, setCharacters] = useState(() => {
    return JSON.parse(localStorage.getItem("characters")) || [];
  });
  const [activeMonsters, setActiveMonsters] = useState(() => {
    return JSON.parse(localStorage.getItem("activeMonsters")) || [];
  });
  const [showHPPopover, setShowHPPopover] = useState(false);
  const [monsterResults, setMonsterResults] = useState([]);
  const [monstersToAdd, setMonstersToAdd] = useState([]);
  const [roundCtr, setRoundCounter] = useState(() => {
    return JSON.parse(localStorage.getItem("roundCtr")) || 1;
  });

  const [addMonstersOpen, setAddMonstersOpen] = useState(false);
  const [combatActive, setCombatActive] = useState(() => {
    return JSON.parse(localStorage.getItem("combatActive") === true || false);
  });

  const sortedMonsters = activeMonsters.sort((a, b) => b.init - a.init);

  const initiative = [...activeMonsters, ...characters];
  const sortedInitiative = initiative.sort((a, b) => b.init - a.init);
  console.log(sortedInitiative);
  const debouncedSearch = useDebounce(query);

  const activeMonsterCardRef = useRef(null);

  const completeButtonRef = useRef(null);

  const activeMonsterIndex = activeMonsters.findIndex(
    (monster) => monster.active === true
  );

  // useEffect(() => {
  //   if (typeof window !== "undefined" && window.localStorage) {
  //     let storedMonsters = JSON.parse(localStorage.getItem("activeMonsters"));
  //     setActiveMonsters(storedMonsters);
  //   }
  // }, []);

  // https://articles.wesionary.team/using-localstorage-with-next-js-a-beginners-guide-7fc4f8bfd9dc
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("activeMonsters", JSON.stringify(activeMonsters));
      localStorage.setItem("combatActive", JSON.stringify(combatActive));
      localStorage.setItem("characters", JSON.stringify(characters));
      // setActiveMonsters(activeMonsters);
    }
  }, [activeMonsters, combatActive, characters]);

  function handleSave() {
    console.log(window.localStorage);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("activeMonsters", JSON.stringify(activeMonsters));
      localStorage.setItem("roundCtr", JSON.stringify(roundCtr));
    }
  }

  function getData() {
    console.log(JSON.parse(window.localStorage.getItem("activeMonsters")));
    if (typeof window !== "undefined" && window.localStorage) {
      let mon = JSON.parse(localStorage.getItem("activeMonsters"));
      setActiveMonsters(mon);
    }
  }

  // EVENT HANDLERS ------------------------------------------------------
  // These are sent down to child components as props
  // ---------------------------------------------------------------------

  function toggleCombat() {
    if (combatActive) {
      setCombatActive(false);
    } else {
      setCombatActive(true);
    }

    const sortedMonsters = activeMonsters
      .slice()
      .sort((a, b) => b.init - a.init);
    console.log(sortedMonsters);
    // Mark the monster with the highest "init" value as active
    const updatedMonsters = sortedMonsters.map((monster, index) => ({
      ...monster,
      active: index === 0, // Set the first monster as active
    }));

    setActiveMonsters(updatedMonsters);
    // setCombatActive(true);
    // setActiveMonsterIndex(0); // Set the active monster index to 0
  }

  const CombatSwitch = () => {
    return (
      <Switch.Group>
        <div className="flex items-center">
          <Switch.Label className="mr-4">Initiative</Switch.Label>

          <Switch
            checked={combatActive}
            onChange={toggleCombat}
            // onChange={setCombatActive}
            className={classNames(
              combatActive ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              className={classNames(
                combatActive ? "translate-x-5" : "translate-x-0",
                "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            >
              <span
                className={classNames(
                  combatActive
                    ? "opacity-0 duration-100 ease-out"
                    : "opacity-100 duration-200 ease-in",
                  "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={classNames(
                  combatActive
                    ? "opacity-100 duration-200 ease-in"
                    : "opacity-0 duration-100 ease-out",
                  "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            </span>
          </Switch>
        </div>
      </Switch.Group>
    );
  };

  const ManageCharacters = () => {
    const [newCharName, setNewCharName] = useState("");
    const [newCharArmorClass, setNewCharArmorClass] = useState("");

    function handleAddCharacter() {
      setCharacters((prev) => [
        ...prev,
        {
          id: nanoid(),
          init: 0,
          name: newCharName,
          armorClass: newCharArmorClass,
          type: "character",
        },
      ]);
    }

    function handleUpdateCharacter(char, e, key) {
      const characterIndex = characters.findIndex((c) => c.id === char.id);
      // console.log(char, characterIndex, characters);
      if (characterIndex !== -1) {
        const updatedCharacters = [...characters];
        updatedCharacters[characterIndex] = {
          ...char,
          [key]: e.target.value,
        };
        setCharacters(updatedCharacters);
        // setCharacters((prevChars) => {
        //   [...prevChars, { ...char, [key]: e.target.value }];
        // });
      }
    }

    function removeCharacter(char) {
      const characterIndex = characters.findIndex((c) => c.id === char.id);
    }

    return (
      <Transition.Root
        show={manageCharactersOpen}
        as={Fragment}
        appear
      >
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setManageCharactersOpen}
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
              <Dialog.Panel className="mx-auto max-w-xl transform rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all text-black">
                <div>
                  <h2 className="text-gray-900">manage party</h2>

                  {characters.length > 0 ? (
                    <>
                      {characters.map((char, idx) => (
                        <div className="flex gap-4">
                          <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                            <label
                              htmlFor="name"
                              className="block text-xs font-medium text-gray-900"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={char.name}
                              onChange={(e) =>
                                handleUpdateCharacter(char, e, "name")
                              }
                              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="Jane Smith"
                            />
                          </div>
                          <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                            <label
                              htmlFor="name"
                              className="block text-xs font-medium text-gray-900"
                            >
                              Armor Class
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={char.armorClass}
                              onChange={(e) =>
                                handleUpdateCharacter(char, e, "armorClass")
                              }
                              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="Jane Smith"
                            />
                          </div>
                          <button
                            onClick={() => {
                              setCharacters(
                                characters.filter((c) => c.id !== char.id)
                              );
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                          <label
                            htmlFor="name"
                            className="block text-xs font-medium text-gray-900"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={(e) => setNewCharName(e.target.value)}
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Jane Smith"
                          />
                        </div>
                        <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                          <label
                            htmlFor="name"
                            className="block text-xs font-medium text-gray-900"
                          >
                            Armor Class
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            // value={char.armorClass}
                            onChange={(e) =>
                              setNewCharArmorClass(e.target.value)
                            }
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Jane Smith"
                          />
                        </div>
                        <button
                          onClick={handleAddCharacter}
                          className="text-black"
                        >
                          save
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-4">
                      <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label
                          htmlFor="name"
                          className="block text-xs font-medium text-gray-900"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          onChange={(e) => setNewCharName(e.target.value)}
                          className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label
                          htmlFor="name"
                          className="block text-xs font-medium text-gray-900"
                        >
                          Armor Class
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          // value={char.armorClass}
                          onChange={(e) => setNewCharArmorClass(e.target.value)}
                          className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <button
                        onClick={handleAddCharacter}
                        className="text-black"
                      >
                        save
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };

  const SearchInput = forwardRef(function SearchInput(
    { autocomplete, autocompleteState, onClose },
    inputRef
  ) {
    return (
      <div className="group relative flex h-12">
        {/* <SearchIcon className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-zinc-500" /> */}
        <input
          ref={inputRef}
          className={clsx(
            "flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none dark:text-white sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden",
            autocompleteState.status === "stalled" ? "pr-11" : "pr-4"
          )}
        />
      </div>
    );
  });

  const AddMonster = () => {
    return (
      <Suspense fallback={null}>
        <Transition.Root
          show={addMonstersOpen}
          as={Fragment}
          // appear
        >
          <Dialog
            initialFocus={completeButtonRef}
            as="div"
            className="relative z-10"
            onClose={() => setAddMonstersOpen(false)}
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
                <Dialog.Panel className="mx-auto max-w-xl transform rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all text-gray-900">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <Dialog.Title
                    as="h2"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Monsters
                  </Dialog.Title>
                  <div className="flex">
                    <div className="w-1/2 mt-2">
                      <SearchBar
                        query={query}
                        // onChange={setQuery}
                        onChange={handleSearchChange}
                        onClick={clearQuery}
                      />
                      {query.length > 0 && (
                        <SearchResults
                          // monsters={debouncedSearchValue}
                          monsters={monsterResults}
                          onChange={batchMonsters}
                          // onChange={handleAddMonster}
                          // onChange={handleAddActiveMonster}
                        />
                      )}
                      <ul>
                        {monstersToAdd.map((monster, idx) => (
                          <li
                            key={idx}
                            // onChange={handleAddMonster}
                          >
                            {monster.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-1/2 bg-sky-500">
                      <ul>
                        {activeMonsters.map((monster, idx) => (
                          <li key={idx}>{monster.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      ref={completeButtonRef}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={addActiveMonsters}
                      // onClick={() => setAddMonstersOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </Suspense>
    );
    // <Transition.Root
    //   show={addMonstersOpen}
    //   as={Fragment}
    //   // afterLeave={() => autocomplete.setQuery("")}
    // >
    //   <Dialog
    //     onClose={setAddMonstersOpen}
    //     className="fixed inset-0 z-50"
    //   >
    //     <Transition.Child
    //       as={Fragment}
    //       enter="ease-out duration-300"
    //       enterFrom="opacity-0"
    //       enterTo="opacity-100"
    //       leave="ease-in duration-200"
    //       leaveFrom="opacity-100"
    //       leaveTo="opacity-0"
    //     >
    //       <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
    //     </Transition.Child>

    //     <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
    //       <Transition.Child
    //         as={Fragment}
    //         enter="ease-out duration-300"
    //         enterFrom="opacity-0 scale-95"
    //         enterTo="opacity-100 scale-100"
    //         leave="ease-in duration-200"
    //         leaveFrom="opacity-100 scale-100"
    //         leaveTo="opacity-0 scale-95"
    //       >
    //         <Dialog.Panel className="mx-auto transform-gpu overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 ring-zinc-900/7.5 dark:bg-zinc-900 dark:ring-zinc-800 sm:max-w-xl">
    //           <div>
    //             <SearchInput
    //               // ref={inputRef}
    //               onClose={() => setAddMonstersOpen(false)}
    //             />
    //           </div>
    //         </Dialog.Panel>
    //       </Transition.Child>
    //     </div>
    //   </Dialog>
    // </Transition.Root>;
  };

  function batchMonsters(monster) {
    setMonstersToAdd([...monstersToAdd, monster]);
  }

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

  // Scroll the active monster into view when it changes
  useEffect(() => {
    if (activeMonsterCardRef.current) {
      activeMonsterCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [activeMonsterIndex]);

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

  function handleSearchChange(e) {
    setQuery(e.target.value);

    // const debouncedFetchMonsters = debounce(() => fetchMonsters(query), 2000);
    // if (query) {
    //   debouncedFetchMonsters();
    // } else {
    //   setMonsterResults([]);
    // }
  }

  function clearQuery() {
    // passed to SearchBar to enable clearing the input
    setQuery("");
    setMonsterResults([]);
  }

  function handleAddActiveMonster(monster) {
    // add monster to initiative
    // 1. check if any activeMonsters already have the same name
    // if no monster with the matching name already has "1" at the end, update the first occurrence to be "[name] 1"
    // otherwise, update the first occurrence to be "[name] 1"
    //

    const existingMonsterIndex = activeMonsters.findIndex(
      (activeMonster) => activeMonster.name === monster.name
    );

    // if (existingMonsterIndex !== -1) {
    //   const updatedMonsters = [...activeMonsters];

    //   if (updatedMonsters[existingMonsterIndex].name.endsWith('1')){

    //   }
    // }

    if (existingMonsterIndex !== -1) {
      // An existing monster with the same name was found
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[existingMonsterIndex].name = getUniqueMonsterName(
        monster.name
      );

      setActiveMonsters([
        ...updatedMonsters,
        {
          ...monster,
          maxHP: monster.hit_points,
          active: false,
          init: rollInitiative(monster.dexterity),
          id: nanoid(),
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
    } else {
      // No existing monster with the same name was found
      setActiveMonsters([
        ...activeMonsters,
        {
          ...monster,
          maxHP: monster.hit_points,
          active: false,
          init: rollInitiative(monster.dexterity),
          id: nanoid(),
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
    }
  }

  function getUniqueMonsterName(baseName) {
    let newName = baseName;
    let count = 1;

    while (
      activeMonsters.some((activeMonster) => activeMonster.name === newName)
    ) {
      newName = `${baseName} ${count}`;
      count++;
    }

    return newName;
  }

  function handleKill(monster) {
    // console.log(monster);
    // set monster hp to zero
    const monsterIndexToKill = activeMonsters.findIndex(
      (m) => m.id === monster.id
    );
    // console.log(monsterIndexToKill);
    if (monsterIndexToKill !== -1) {
      // Create a new array with the updated monster object
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[monsterIndexToKill] = { ...monster, hit_points: 0 };

      // Update the state with the new array
      setActiveMonsters(updatedMonsters);
    }
  }

  function handleDeleteMonster(monster) {
    // remove monster from activeMonsters
    const monsterIndex = activeMonsters.findIndex((m) => m.id === monster.id);
    if (monsterIndex !== -1) {
      const updatedMonsters = activeMonsters.filter(
        (_, index) => index !== monsterIndex
      );
      setActiveMonsters(updatedMonsters);
    }
  }

  function handleMonsterCondition(monster, condition) {
    // find the monster index
    const monsterIndex = activeMonsters.findIndex((m) => m.id === monster.id);

    if (monsterIndex !== -1) {
      const updatedMonsters = [...activeMonsters];
      const currentConditionValue = monster.conditions[condition];

      if (condition === "CLEAR") {
        const updatedConditions = {};
        for (const key in monster.conditions) {
          if (monster.conditions.hasOwnProperty(key)) {
            updatedConditions[key] = false;
          }
        }
        updatedMonsters[monsterIndex] = {
          ...monster,
          conditions: updatedConditions,
        };
      } else {
        updatedMonsters[monsterIndex] = {
          ...monster,
          conditions: {
            ...monster.conditions,
            [condition]: !currentConditionValue,
          },
        };
      }

      // Update the state with the new array
      setActiveMonsters(updatedMonsters);
    }
  }

  function startCombat() {
    const sortedMonsters = activeMonsters
      .slice()
      .sort((a, b) => b.init - a.init);
    console.log(sortedMonsters);
    // Mark the monster with the highest "init" value as active
    const updatedMonsters = sortedMonsters.map((monster, index) => ({
      ...monster,
      active: index === 0, // Set the first monster as active
    }));

    setActiveMonsters(updatedMonsters);
    setCombatActive(true);
    // setActiveMonsterIndex(0); // Set the active monster index to 0
  }

  function nextTurn() {
    console.log(activeMonsterCardRef);
    if (activeMonsterCardRef.current) {
      activeMonsterCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
    const activeIndex = activeMonsters.findIndex((monster) => monster.active);

    if (activeIndex !== -1) {
      const updatedMonsters = [...activeMonsters]; // copy the activeMonster array so that we don't modify the original
      updatedMonsters[activeIndex].active = false; // mark the currently active monster as inactive

      const sortedMonsters = updatedMonsters
        .slice()
        .sort((a, b) => b.init - a.init);

      // find the index of the next monster that will be active.
      // If activeIndex is less than the length of sortedMonsters - 1, increment the index by 1.
      // Otherwise, if it's the last monster in the array, wrap around to the first monster (0 index)
      const nextActiveIndex =
        activeIndex < sortedMonsters.length - 1 ? activeIndex + 1 : 0;

      // Check if the next turn starts a new round
      if (nextActiveIndex === 0) {
        setRoundCounter(roundCounter + 1);
        // turnCounter = 1
      }

      sortedMonsters[nextActiveIndex].active = true;

      setActiveMonsters(sortedMonsters);
    }
  }

  function previousTurn() {
    const activeIndex = activeMonsters.findIndex((monster) => monster.active);

    if (activeIndex !== -1) {
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[activeIndex].active = false;

      const sortedMonsters = updatedMonsters
        .slice()
        .sort((a, b) => b.init - a.init);
      const previousActiveIndex =
        activeIndex > 0 ? activeIndex - 1 : sortedMonsters.length - 1;

      sortedMonsters[previousActiveIndex].active = true;

      setActiveMonsters(sortedMonsters);
    }
  }

  function handleMonsterInitChange(monster, e) {
    const monsterIndex = activeMonsters.findIndex((m) => m.id === monster.id);
    const updatedMonsters = [...activeMonsters];
    updatedMonsters[monsterIndex] = { ...monster, init: e.target.value };
    setActiveMonsters(updatedMonsters);
  }

  function handleMonsterUpdate(monster, keyToUpdate, newValue) {
    const monsterIndex = activeMonsters.findIndex((m) => m.id === monster.id);
    if (monsterIndex !== -1) {
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[monsterIndex] = { ...monster, [keyToUpdate]: newValue };
      setActiveMonsters(updatedMonsters);
    }
  }

  return (
    <div className="bg-slate-600 rounded-lg col-span-4 row-span-6 m-5 flex flex-col items-center relative">
      <AddMonster />
      <ManageCharacters />
      {/* Header */}
      <div
        id="header"
        className="w-full bg-pink-600 border-b border-slate-200 px-3 py-4"
      >
        <h1 className="text-sm uppercase">combat tracker</h1>
        {/* <div className="">
          <button onClick={() => setActiveMonsters([])}>clear</button>
          <ClockIcon className="h-6 w-6" />
          <HeartIcon className="h-6 w-6" />
          <button
            className="h-6"
            onClick={() => setAddMonstersOpen(true)}
          >
            add monsters
          </button>
        </div> */}
        <CombatSwitch />
        <button onClick={handleSave}>save</button>
        <button onClick={getData}>get</button>
        {/* Button Group */}
        <span className="isolate inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <span className="sr-only">Previous</span>
            <ChevronDownIcon
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <span className="sr-only">Next</span>
            <ChevronUpIcon
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </span>
        <button
          onClick={() => setManageCharactersOpen(true)}
          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <UserGroupIcon
            className="h-5 w-5"
            aria-hidden="true"
          />
          Characters
        </button>
        <button
          onClick={() => setAddMonstersOpen(true)}
          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <UserGroupIcon
            className="h-5 w-5"
            aria-hidden="true"
          />
          Monsters
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto overflow-x-hidden h-full w-full p-3">
        <ul className="w-full flex flex-col space-y-2">
          {sortedInitiative.map((monster, index) => {
            return (
              <li key={monster.id}>
                {monster.type === "monster" ? (
                  <MonsterCard
                    ref={
                      index === activeMonsterIndex ? activeMonsterCardRef : null
                    }
                    monster={monster}
                    onKill={handleKill}
                    onDelete={handleDeleteMonster}
                    onInitChange={handleMonsterInitChange}
                    onSetCondition={handleMonsterCondition}
                    onOpenHPPopover={setShowHPPopover}
                  />
                ) : (
                  <ul>char</ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// {sortedInitiative.map((monster, index) => (
//   <li key={monster.id}>
//     {/* <span>{index}</span> */}
//     <MonsterCard
//       ref={index === activeMonsterIndex ? activeMonsterCardRef : null}
//       monster={monster}
//       onKill={handleKill}
//       onDelete={handleDeleteMonster}
//       onInitChange={handleMonsterInitChange}
//       onSetCondition={handleMonsterCondition}
//       onOpenHPPopover={setShowHPPopover}
//     />
//   </li>
// ))}
