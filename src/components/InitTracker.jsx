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
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";

// Components
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import MonsterCard from "@/components/MonsterCard";
import HitPointPopover from "@/components/HitPointPopover";

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
} from "@heroicons/react/24/outline";

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

export default function Home() {
  const [query, setQuery] = useState("");
  const [addMonstersOpen, setAddMonstersOpen] = useState(false);
  const [activeMonsters, setActiveMonsters] = useState([]);
  const [showHPPopover, setShowHPPopover] = useState(false);
  // const results = filterMonsters(monsters, query);
  const [monsterResults, setMonsterResults] = useState([]);
  const [monstersToAdd, setMonstersToAdd] = useState([]);
  const [roundCounter, setRoundCounter] = useState(1);
  const sortedMonsters = activeMonsters.sort((a, b) => b.init - a.init);
  const debouncedSearch = useDebounce(query);
  // const [activeMonsterIndex, setActiveMonsterIndex] = useState(null);
  const activeMonsterCardRef = useRef(null);
  const activeMonsterIndex = activeMonsters.findIndex(
    (monster) => monster.active === true
  );
  // console.log("activeMonsterIndex:", activeMonsterIndex);

  // EVENT HANDLERS ------------------------------------------------------
  // These are sent down to child components as props
  // ---------------------------------------------------------------------

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
          appear
        >
          <Dialog
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
                  <Dialog.Title
                    as="h2"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Monsters
                  </Dialog.Title>
                  <div className="mt-2">
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

                  <div className="mt-4">
                    <button
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
    console.log(monstersToAdd);

    monstersToAdd.map((monster) => {
      setActiveMonsters((prev) => [
        ...prev,

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
    });
  }
  useEffect(() => {
    // Scroll the active monster into view when it changes
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

  // useEffect(() => {
  //   debouncedFetchMonsters(query);
  // }, [query]);

  useEffect(() => {
    if (query) {
      fetchMonsters(query);
    } else {
      setMonsterResults([]);
    }
  }, [debouncedSearch]);

  // useEffect(() => {
  //   if (query) {
  //     debouncedInputSearch(query);
  //   } else {
  //     setMonsterResults([]);
  //   }
  // }, [query]);

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
    <div className="bg-slate-600 rounded-lg col-span-4 row-span-6 m-5 p-3 flex flex-col items-center relative">
      <AddMonster />
      <div
        id="header"
        className="w-full bg-pink-600 "
      >
        <h1 className="text-sm uppercase">combat tracker</h1>
        <div className="">
          <button onClick={() => setActiveMonsters([])}>clear</button>
          <ClockIcon className="h-6 w-6" />
          <HeartIcon className="h-6 w-6" />
          <button
            className="h-6"
            onClick={() => setAddMonstersOpen(true)}
          >
            add monsters
          </button>
        </div>

        {/* <div className="w-full">
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
              onChange={handleAddActiveMonster}
            />
          )}
        </div> */}
      </div>
      <div className="overflow-y-auto overflow-x-hidden h-full w-full">
        <ul className="w-full flex flex-col space-y-2">
          {sortedMonsters.map((monster, index) => (
            <li key={monster.id}>
              {/* <span>{index}</span> */}
              <MonsterCard
                ref={index === activeMonsterIndex ? activeMonsterCardRef : null}
                monster={monster}
                onKill={handleKill}
                onDelete={handleDeleteMonster}
                onInitChange={handleMonsterInitChange}
                onSetCondition={handleMonsterCondition}
                onOpenHPPopover={setShowHPPopover}
              />
              {/* <HitPointPopover /> */}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full justify-between mt-auto">
        <button
          onClick={startCombat}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-300"
        >
          <PlayIcon className="h-6 w-6" />
        </button>

        <div className="">
          <span className="uppercase">round</span>
          <span className="ml-2">{roundCounter}</span>
          {/* {turnCounter} */}
        </div>

        <div className="flex gap-2">
          <button
            onClick={previousTurn}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-300"
          >
            <ChevronUpIcon className="h-6 w-6" />
          </button>
          <button
            onClick={nextTurn}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-300"
          >
            <ChevronDownIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
